require("dotenv").config();
const { rememberNotifications } = require("../helpers/config");
const moment = require("moment");
const round_manager = require("../managers/round");
const userManager = require("../managers/user");
const config = require("../helpers/config");
const cryptoUtil = require("../utils/crypto");
const walletUtil = require("../utils/wallet");
const blockchain = require("../services/blockchain");

const {
	MONGO_SERVER,
	MONGO_DATABASE,
	REFILL_SECONDS,
	REFILL_MINUTES,
	REFILL_HOURS,
	REFILL_DAY_OF_MONTH,
	REFILL_MONTH,
	REFILL_DAY_OF_WEEL,
	WALLET_TARGET_BALANCE,
	WALLET_MIN_BALANCE,
	REFILL_ORIGIN_ACCOUNT,
	REFILL_ORIGIN_ACCOUNT_PK,
} = process.env;

const mongoConnectionString = `${MONGO_SERVER}/${MONGO_DATABASE}`;

const Agenda = require("agenda");
const types = require("./types");
const {
	roundNotStarted,
	completedRound,
} = require("../helpers/notifications/notifications");
const {
	createNotification,
	INTENTS,
} = require("../helpers/notifications/config");
const { customError } = require("../helpers/errorHandler");
const CronJob = require("cron").CronJob;

const agenda = new Agenda({
	db: { address: mongoConnectionString },
	processEvery: "1 minutes",
});

// Messages
const {
	shiftAboutToEnd,
	roundStartedDate,
} = require("../helpers/notifications/messages");
const { SC_FEATURES } = require("../utils/other");
const credential_services = require("../services/credential");

// Define jobs
agenda.define(types.NOTIFICATIONS_PAYS_REMEMBER, async (job) => {
	const { roundId, number } = job.attrs.data;

	// Refresh round data
	const updatedRound = await round_manager.findById(roundId);

	if (updatedRound) {
		// Get days left
		const objectSubstract = rememberNotifications[updatedRound.recurrence];
		const daysLeft = objectSubstract.days;

		// Get shift
		const shift = updatedRound.shifts.find(
			(shift) => shift.number.toString() === number.toString()
		);

		// Get not paid participants
		const notPaidParticipants = updatedRound.participants.filter(
			(participant) => !shift.pays.includes(participant._id)
		);

		// Uuser tokens of not paid participants
		const notPaidTokens = notPaidParticipants
			.map((p) => p.user.token)
			.filter((t) => t);

		// Get admin name
		const adminName = updatedRound.admin.name;

		// Get end date
		const endDate = shift.limitDate;
		const notificationData = {
			action: JSON.stringify({
				routeName: "RoundDetail",
				params: { _id: updatedRound._id },
				intent: INTENTS.REMEMBER_PAYMENT,
				roundName: updatedRound.name,
				shiftNumber: shift.number.toString(),
				limitDate: shift.limitDate,
			}),
		};

		console.log(`Send scheduled notification payment remember`);

		const notificationResult = await createNotification(
			notPaidTokens,
			"La ronda",
			shiftAboutToEnd(daysLeft, number, adminName, endDate),
			notificationData
		);

		return notificationResult;
	}
});

agenda.define(types.ROUND_START_DATE, async (job) => {
	const { roundId } = job.attrs.data;

	// Get round
	const round = await round_manager.findById(roundId);

	// Only if round exist and not started yet
	if (round && round.start === false) {
		// Check that no participants rejected (acepted = false)
		const rejectedParticipants = round.participants.filter(
			(e) => e.acepted === false
		);
		if (rejectedParticipants.length) return roundNotStarted(round);

		// Start round
		round.start = true;
		// Mark first shift as current
		round.shifts[0].status = "current";
		// Save changes to round
		const updatedRound = await round_manager.save(round);
		if (updatedRound === null)
			throw new customError("Error starting round in schedule");

		// Get round participants user token (avoid nulls)
		const roundUserTokens = round.participants
			.map((p) => p.user.token)
			.filter((t) => t);

		// Round name
		const roundName = round.name;
		const data = {
			action: JSON.stringify({
				routeName: "RoundDetail",
				params: { _id: round._id },
				admin: round.admin,
				roundName: round.name,
				intent: INTENTS.ROUND_START,
			}),
		};
		console.log(`Send scheduled notification...`);
		const notificationResult = await createNotification(
			roundUserTokens,
			"La ronda",
			roundStartedDate(roundName),
			data
		);

		return notificationResult;
	}
});

agenda.define(types.ROUND_NUMBER_CHANGE, async (job) => {
	const { roundId } = job.attrs.data;
	console.log(`Job for round id ${roundId} change number started`);
	// Get round
	const round = await round_manager.findById(roundId);
	let sendCompletedNotification = false;
	// Round must be started
	if (!round) console.error(`Round with id ${roundId} not found!`);
	if (round && round.start) {
		// Which shift are we in?
		const currentShiftIndex = round.shifts.findIndex(
			(s) => s.status === "current"
		);
		console.log(JSON.stringify(round.shifts));
		console.log(`Current shift index is ${currentShiftIndex}`);
		if (currentShiftIndex != -1) {
			// Mark it as completed
			round.shifts[currentShiftIndex].status = "completed";
			const currentNumber = round.shifts[currentShiftIndex].number;
			const nextShiftIndex = round.shifts.findIndex(
				(s) => s.number === currentNumber + 1
			);
			// Are we in range?
			console.log(
				`Job for round id ${roundId} changed the status of shift to completed`
			);
			if (nextShiftIndex != -1) {
				// If we are in range, mark the next one as current

				round.shifts[nextShiftIndex].status = "current";

				console.log(
					`Job for round id ${roundId} changed the status of the next shift to current`
				);
			} else {
				sendCompletedNotification = true;
			}
		}
		// Save changes to round
		try {
			const updatedRound = await round_manager.save(round);
			await credential_services.emmitRoundParticipants(round);
			console.log(`Job for round ${roundId} ran successfuly`);
			if (sendCompletedNotification)
				console.log(`Job for round ${roundId} will send ending notifications`);
			if (updatedRound === null)
				throw new customError("Error changing round number");
		} catch (error) {
			console.error(`Job for round ${roundId} had a failure when saving`);
			console.error(error);
		}

		if (sendCompletedNotification) {
			// TODO: encolar participantes o emitir ronda
			await completedRound(round);
		}
	}

	return true;
});

// Start method
exports.agendaStart = () => {
	console.log("Starting agenda...");
	agenda.start();
};

// Create job
exports.createPayRememberJob = (taskDate, roundId, number) => {
	const scheduleDate = config.scheduleNotificationsTime(
		taskDate.year(),
		taskDate.month(),
		taskDate.date()
	);
	console.log(`Creating task for ${scheduleDate}...`);
	const notificationData = { roundId, number };
	agenda.schedule(
		scheduleDate,
		types.NOTIFICATIONS_PAYS_REMEMBER,
		notificationData
	);
};

exports.createNumberChangeRoundJob = (round) => {
	const dates = round.shifts.map((s) => s.limitDate);
	const { id } = round;
	const data = { roundId: id };
	dates.forEach((d, i) => {
		const offSet = moment().utcOffset();
		const date = moment
			.utc(d)
			.add("minutes", offSet)
			.toDate();
		console.log("Creating schedule for number ", i + 1);
		console.log("Date will be ", date);
		agenda.schedule(date, types.ROUND_NUMBER_CHANGE, data);
	});
};

exports.createStartRoundJob = (taskDate, roundId) => {
	const scheduleDate = config.scheduleJobsTime(
		taskDate.year(),
		taskDate.month(),
		taskDate.date()
	);
	console.log(`Creating task for ${scheduleDate}...`);
	const data = { roundId };
	agenda.schedule(scheduleDate, types.ROUND_START_DATE, data);
};

exports.updateStartRoundJob = async (taskDate, roundId) => {
	const scheduleDate = config.scheduleJobsTime(
		taskDate.year(),
		taskDate.month(),
		taskDate.date()
	);
	console.log(`Removing task for ${scheduleDate}...`);
	const data = { roundId };
	const jobs = await agenda.jobs({ data });
	await jobs[0].remove();
	this.createStartRoundJob(taskDate, roundId);
};

exports.walletRefillJob = () => {
	if (SC_FEATURES) {
		const frequency = [
			REFILL_SECONDS,
			REFILL_MINUTES,
			REFILL_HOURS,
			REFILL_DAY_OF_MONTH,
			REFILL_MONTH,
			REFILL_DAY_OF_WEEL,
		].join(" ");
		new CronJob(
			frequency,
			async () => {
				try {
					const users = await userManager.manyWithBalanceBelowOrEqual(
						WALLET_MIN_BALANCE
					);
					const WALLET_TARGET_WEI = blockchain.toWei(WALLET_TARGET_BALANCE);
					const addressIdMap = {};
					const transactions = users.map(async (u) => {
						try {
							// Users without a private key
							if (!u.walletAddress) {
								const { address, privateKey } = await walletUtil.createWallet();

								const encryptedPK = cryptoUtil.cipher(privateKey);
								const encryptedAddress = cryptoUtil.cipher(address);
								addressIdMap[address] = u._id;
								return {
									walletAddress: encryptedAddress,
									walletPk: encryptedPK,
									address,
									new: true,
									id: u._id,
								};
							}
							const address = cryptoUtil.decipher(u.walletAddress);
							addressIdMap[address] = u._id;
							return {
								address,
								id: u._id,
							};
						} catch (error) {
							console.log("Failure in creating RBTC tx object for user: ", u);
							return {};
						}
					});
					const finalTransactions = await Promise.all(transactions);
					const performAddtionOfWallets = finalTransactions.map(async (t) => {
						if (t.new) {
							const result = await userManager.addWallet(
								t.id,
								t.walletAddress,
								t.walletPk
							);
							if (!result)
								return { result, error: `Failed to add wallet to ${t.id}` };
						}
						return { result: true };
					});
					await Promise.all(performAddtionOfWallets);
					try {
						const results = await blockchain.sendManyBalanceTx(
							REFILL_ORIGIN_ACCOUNT,
							REFILL_ORIGIN_ACCOUNT_PK,
							finalTransactions.map((t) => t.address),
							WALLET_TARGET_WEI
						);
						const acreditedFinal = await Promise.all(
							results.map(async ({ address, error, success }) => {
								if (!success) return { success: false, error };
								const userId = addressIdMap[address];
								try {
									const user = await userManager.byId(userId);
									if (user) {
										user.lastBalance = WALLET_TARGET_BALANCE;
										await user.save();
										return { success: true, user: user._id };
									}
									return { success: false, error: "User not found" };
								} catch (error) {
									return { success: false, error: "" };
								}
							})
						);
						console.log(`Resolved ${acreditedFinal.length} transactions`);
					} catch (error) {
						return { result: false, error };
					}
				} catch (error) {
					console.log("Error on WalletRefill Cron: ", error);
				}
			},
			//Execute once when api started
			null,
			true,
			"America/Argentina/Buenos_Aires",
			null,
			true
		);
	}
};
