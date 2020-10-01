exports.recurrenceConfig = {
	d: { days: 1 },
	s: { days: 7 },
	q: { days: 15 },
	m: { months: 1 },
};

exports.shiftStatus = ["pending", "current", "completed"];

exports.rememberNotifications = {
	s: { days: 2 },
	q: { days: 5 },
	m: { days: 10 },
};

exports.normalRecurrenceValues = {
	d: "Diaria",
	s: "Semanal",
	q: "Quincenal",
	m: "Mensual",
};

// Schedule times
exports.scheduleNotificationsTime = (year, month, day) =>
	new Date(year, month, day, 17, 0, 0);
exports.scheduleJobsTime = (year, month, day) =>
	new Date(year, month, day, 9, 0, 0);
