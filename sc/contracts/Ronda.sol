// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21;
import "./RondasRegistry.sol";

contract Ronda {
    address admin; // ronda admin
    string id; // The Ronda ID
    address registry; // The registry contract address
    uint256 startDate; // start date of the ronda
    uint256 currentPayment = 0; // Curent index of the round Payments
    uint256 currentCharge = 0; // Curent index of the round Payments

    /**
        STATES
        PENDING => Participant did not accept / reject the invitation yet
        ACCEPTED => Participant accepted to take part in the round
        REJECTED => Participant rejected the invitation to participate in the Round
     */
    enum ParticipantState {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    struct RondaParticipant {
        address participant; // address of the ronda participant
        uint256 acceptedMoment; // block number of the moment the participant ACCEPTED or REJECTED to be part of the ronda
        ParticipantState state; // See enum data
        address madeBy; // who made the action of reject or accept?
        bool exists;
    }

    struct RondaPayment {
        address participant; // Participant that made the payment
        uint256 doneMoment; // At what moment was done
        uint32 amount; // Amount of the payment
        bool exists;
        bool deleted;
        uint256 deletedMoment;
    }

    struct RondaCharge {
        address participant; // Participant that received the payment
        address confirmedBy; // Participant that confirmed the payment
        uint256 doneMoment; // At what moment was done
        uint32 amount; // Amount of the payment
        bool exists;
    }

    // stores all the participants
    mapping(address => RondaParticipant) participants;

    // Store payments
    mapping(uint256 => RondaPayment) payments;

    // Store charges
    mapping(uint256 => RondaCharge) charges;

    // Event to trigger when we add participants to a Ronda
    event AddParticipantsToRonda(
        address indexed _admin,
        address[] _participants
    );

    // Event to trigger when we add participant to a Ronda
    event AddParticipantToRonda(
        address indexed _admin,
        address indexed _participant
    );

    // Event to trigger when a participant accept an invitation
    event AcceptParticipantToRonda(
        address indexed _admin,
        address indexed _participant
    );

    // Event to trigger when a participant reject an invitation
    event RejectParticipantToRonda(
        address indexed _admin,
        address indexed _participant
    );

    // Event to trigger when the ronda has started
    event RondaStarted(address indexed _admin, uint256 _blockNumber);

    // Event to trigger when the Admin accepts an invitation from a participant
    event AcceptInvitationByAdmin(
        address indexed _admin,
        address indexed _participant,
        uint256 _blockNumber
    );

    // Event to trigger when the Admin reject an invitation from a participant
    event RejectInvitationByAdmin(
        address indexed _admin,
        address indexed _participant,
        uint256 _blockNumber
    );

    // Event to trigger when the sender will record a payment with that amount and the block number
    event MakePayment(
        address indexed _admin,
        address indexed _participant,
        uint32 _amount,
        uint256 _blockNumber
    );

    // Event to trigger when a participant or admin confirms a Ronda Charge
    event MakeCharge(
        address indexed _participant,
        address indexed _confirmedBy,
        uint32 _amount,
        uint256 _blockNumber
    );

    // Event that will replace a participant from a ronda with a new one
    event ReplaceParticipant(
        address indexed admin,
        address indexed _oldParticipant,
        address indexed _newParticipant
    );

    // When a payment is deleted
    event DeletedPayment(uint256 indexed number, uint256 indexed timeMade);

    /**
        @notice Modifier for participant check access
        @dev this modifier requires that the participant exists and also that the participant is on PENDING status
    */
    modifier onlyExistantAndPendingParticipant() {
        require(
            participantExists(msg.sender),
            "The participant doesn't exists"
        );
        require(
            participantStateIsPending(msg.sender),
            "The participant state must be pending"
        );
        _;
    }

    /**
        @notice Modifier for admin check access to perform certain operations over a participant
        @dev this modifier requires that the participant exists in the ronda and also that the participant is on PENDING status
    */
    modifier participantExistsAndIsPending(address _addr) {
        require(participantExists(_addr), "The participant doesn't exists");
        require(
            participantStateIsPending(_addr),
            "The participant state must be pending"
        );
        _;
    }

    /**
        @notice Modifier to check if Ronda is still active
        @dev this modifier requires that the ronda is not finished
    */
    modifier rondaIsActive() {
        RondasRegistry registrySC = RondasRegistry(registry);
        require(
            registrySC.rondaExists(id),
            "Ronda does not exist in registry!"
        );
        require(registrySC.rondaIsActive(id), "Ronda is not active!");
        _;
    }

    /**
        @dev Modifier for functions that can be run by only admin
     */
    modifier onlyAdmin() {
        require(isAdmin(), "Is not admin!");
        _;
    }

    /**
        @notice Only the admin will pass this check
     */
    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    /**
        @notice This function checks if a participant address exists in the Ronda
        @param _addr address This is the address of the participant we are checking
        @return bool
    */
    function participantExists(address _addr) public view returns (bool) {
        return participants[_addr].exists;
    }

    /**
        @notice Function that checks if participant is on state PENDING
        @param _addr address of the participant
        @return bool
     */
    function participantStateIsPending(address _addr)
        public
        view
        returns (bool)
    {
        return participants[_addr].state == ParticipantState.PENDING;
    }

    /**
        @notice check only for the participant existance
        @param _addr address Participant address if exists in the Ronda
    */
    modifier participantExistsInRound(address _addr) {
        require(participantExists(_addr), "The participant doesn't exists");
        _;
    }

    /**
        @notice check that the participant DOES NOT exist in the Ronda
        @param _addr address Participant address if exists in the Ronda
    */
    modifier participantNotExistsInRound(address _addr) {
        require(
            !participantExists(_addr),
            "The participant already exists in the Ronda"
        );
        _;
    }

    constructor(
        address _admin,
        address _registry,
        string memory _id
    ) public {
        admin = _admin;
        registry = _registry;
        id = _id;
    }

    /**
        @notice Given a certain address of participant, return the participant data related it
        @dev Only the admin should use this function see {onlyAdmin}
        @param _addr address of the participant
        @return address of the participant
        @return uint256 accepted or rejected moment
        @return ParticipantState state of the participant see {ParticipantState}
        @return address who made the action of reject or accept?
        @return bool internal use to see if the participant exists or not in Ronda

    */
    function getParticipant(address _addr)
        external
        view
        onlyAdmin
        returns (
            address,
            uint256,
            ParticipantState,
            address,
            bool
        )
    {
        return (
            participants[_addr].participant,
            participants[_addr].acceptedMoment,
            participants[_addr].state,
            participants[_addr].madeBy,
            participants[_addr].exists
        );
    }

    /**
        @notice Given an array of addresses (who will be participants) it adds them to the round and stores them
        Participants will be in a pending state until they accept or reject the round invitation
        @dev Only the admin may call this function see {onlyAdmin}
        @param _addresses address[] array of participants address to be added into the Ronda
     */
    function addParticipants(address[] calldata _addresses)
        external
        onlyAdmin
        rondaIsActive
    {
        for (uint8 i = 0; i < _addresses.length; i++) {
            if (!participants[_addresses[i]].exists) {
                participants[_addresses[i]].participant = _addresses[i];
                participants[_addresses[i]].state = ParticipantState.PENDING;
                participants[_addresses[i]].exists = true;
            }
        }
        emit AddParticipantsToRonda(admin, _addresses);
    }

    /**
        @notice Given an address, add it as a participant to the round, same as the addParticipants but only 1 at a time
        @dev Only the admin may call this function see {onlyAdmin}
        @param _participantAddr address Participant Address to add in the Ronda
     */
    function addParticipant(address _participantAddr)
        external
        onlyAdmin
        rondaIsActive
    {
        require(
            !participants[_participantAddr].exists,
            "The participant is already present on the round"
        );

        participants[_participantAddr].participant = _participantAddr;
        participants[_participantAddr].state = ParticipantState.PENDING;
        participants[_participantAddr].exists = true;

        emit AddParticipantToRonda(admin, _participantAddr);
    }

    /**
        @notice A participant may call this function to accept the invitation to a Round.
        @dev The accepted/rejected moment will be recorded with the block number
        @dev The participant must exist, be the sender, and be pending in order to accept see {onlyExistantAndPendingParticipant}
     */
    function acceptInvitationToParticipate()
        external
        onlyExistantAndPendingParticipant
        rondaIsActive
    {
        participants[msg.sender].state = ParticipantState.ACCEPTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;

        emit AcceptParticipantToRonda(admin, msg.sender);
    }

    /**
        @notice A participant may call this function to REJECT the invitation to a Round.
        @dev The accepted/rejected moment will be recorded with the block number
        @dev The participant must exist, be the sender, and be pending in order to accept see {onlyExistantAndPendingParticipant}
     */
    function rejectInvitationToParticipate()
        external
        onlyExistantAndPendingParticipant
        rondaIsActive
    {
        participants[msg.sender].state = ParticipantState.REJECTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;

        emit RejectParticipantToRonda(admin, msg.sender);
    }

    /**
        @notice The admin may call this function to "start" a round and record it start block
        @dev Only the admin may call this function see {onlyAdmin}
    */
    function start() external onlyAdmin rondaIsActive {
        require(startDate == 0, "The ronda is already started");

        startDate = block.number;

        emit RondaStarted(admin, startDate);
    }

    /**
        @notice The admin may call this function to ACCEPT the invitation to a Round of a participant.
        @dev The accepted moment will be recorded with the block number 
        @dev The participant must exist, and be pending in order to accept see {participantExistsAndIsPending}
        @dev Only the admin may call this function see {onlyAdmin}
        @param _participant address Participant Address
     */
    function acceptInvitationByAdmin(address _participant)
        external
        onlyAdmin
        participantExistsAndIsPending(_participant)
        rondaIsActive
    {
        participants[_participant].state = ParticipantState.ACCEPTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;

        emit AcceptInvitationByAdmin(admin, _participant, block.number);
    }

    /**
        @notice The admin may call this function to REJECT the invitation to a Round of a participant.
        @dev The rejected moment will be recorded with the block number
        @dev The participant must exist, and be pending in order to accept see {participantExistsAndIsPending}
        @dev Only the admin may call this function see {onlyAdmin}
     */
    function rejectInvitationByAdmin(address _participant)
        external
        onlyAdmin
        participantExistsAndIsPending(_participant)
        rondaIsActive
    {
        participants[_participant].state = ParticipantState.REJECTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;

        emit RejectInvitationByAdmin(admin, _participant, block.number);
    }

    /**
        @notice The admin may call this function to replace a participant in the round 
        The old participant address and the new one must be provided for them to be changed
        @dev In case that the round hasn't started, the participant will be in a pending state
        @dev In started rounds it will be automatically accepted
        @dev The participant must exist in round see {participantExistsInRound}
        @dev Only the admin may call this function see {onlyAdmin}
        @param _oldParticipant address Participant old address
        @param _newParticipant address Participant new address
     */
    function replaceParticipant(
        address _oldParticipant,
        address _newParticipant
    )
        external
        onlyAdmin
        participantExistsInRound(_oldParticipant)
        participantNotExistsInRound(_newParticipant)
        rondaIsActive
    {
        participants[_newParticipant].participant = _newParticipant;
        participants[_newParticipant].acceptedMoment = 0;
        if (startDate == 0) {
            participants[_newParticipant].state = ParticipantState.PENDING;
            participants[_newParticipant].madeBy = address(0);
        } else {
            participants[_newParticipant].state = ParticipantState.ACCEPTED;
            participants[_newParticipant].madeBy = msg.sender;
            participants[_newParticipant].acceptedMoment = block.number;
        }
        participants[_oldParticipant].exists = false;
        participants[_newParticipant].exists = true;

        emit ReplaceParticipant(admin, _oldParticipant, _newParticipant);
    }

    /**
        @notice Given an amount, the sender will record a payment with that amount and the block number that was performed on
        @dev Any participant may call this function as long as they exist in the round see {participantExistsInRound}
        @param amount uint32 Amount 
     */
    function makeCharge(uint32 amount)
        external
        participantExistsInRound(msg.sender)
        rondaIsActive
    {
        currentCharge = currentCharge + 1;
        charges[currentCharge].participant = msg.sender;
        charges[currentCharge].doneMoment = block.number;
        charges[currentCharge].confirmedBy = msg.sender;
        charges[currentCharge].amount = amount;
        charges[currentCharge].exists = true;

        emit MakeCharge(msg.sender, msg.sender, amount, block.number);
    }

    /**
        @notice Given an amount, the sender will record a charge with that amount and the block number that was performed on
        @dev Any participant may call this function as long as they exist in the round see {participantExistsInRound}
        @param amount uint32 Amount 
     */
    function makePayment(uint32 amount)
        external
        participantExistsInRound(msg.sender)
        rondaIsActive
    {
        currentPayment = currentPayment + 1;
        payments[currentPayment].participant = msg.sender;
        payments[currentPayment].doneMoment = block.number;
        payments[currentPayment].amount = amount;
        payments[currentPayment].exists = true;
        payments[currentPayment].deleted = false;
        payments[currentPayment].deletedMoment = 0;

        emit MakePayment(admin, msg.sender, amount, block.number);
    }

    /**
        @notice Allows the admin to inspect the data of a given payment number
        @dev Only the admin may call this function see {onlyAdmin}
        @param  _number uint256 payment number
        @return address who made it
        @return uint256 at what moment
        @return uint32 the amount
     */
    function getPayment(uint256 _number)
        external
        view
        onlyAdmin
        returns (
            address,
            uint256,
            uint32,
            bool,
            uint256
        )
    {
        require(payments[_number].exists, "The payment doesn't exist");
        return (
            payments[_number].participant,
            payments[_number].doneMoment,
            payments[_number].amount,
            payments[_number].deleted,
            payments[_number].deletedMoment
        );
    }

    /**
        @notice Allows the admin to inspect the data of a given payment number
        @dev Only the admin may call this function see {onlyAdmin}
        @param  _number uint256 payment number
        @return address who made it
        @return uint256 at what moment
        @return uint32 the amount
     */
    function getCharge(uint256 _number)
        external
        view
        onlyAdmin
        returns (
            address,
            address,
            uint256,
            uint256
        )
    {
        require(charges[_number].exists, "The charge doesn't exist");
        return (
            charges[_number].participant,
            charges[_number].confirmedBy,
            charges[_number].doneMoment,
            charges[_number].amount
        );
    }

    /**
        @notice Allows the admin to delete a payment and mark it as deleted with its block number
        @dev Only the admin may call this function see {onlyAdmin}
     */
    function deletePayment(uint256 _number) external onlyAdmin rondaIsActive {
        require(payments[_number].exists, "The payment doesn't exist");
        payments[_number].deleted = true;
        payments[_number].deletedMoment = block.number;

        emit DeletedPayment(_number, block.number);
    }

    /**
        @notice Allows the admin to get the current quantity of payments registered on the Round
        @dev Only the admin may call this function see {onlyAdmin}
        @return uint256 number of payments of the round.
     */
    function getQuantityOfPayments() external view onlyAdmin returns (uint256) {
        return currentPayment;
    }

    /**
        @notice Allows the admin to get the current quantity of charges registered on the Round
        @dev Only the admin may call this function see {onlyAdmin}
        @return uint256 number of charges of the round.
     */
    function getQuantityOfCharges() external view onlyAdmin returns (uint256) {
        return currentCharge;
    }

    /**
        @notice Allows the admin to pass the admin to another address
        @dev Only the admin may call this function see {onlyAdmin}
     */
    function changeAdmin(address _newAdmin) external onlyAdmin rondaIsActive {
        admin = _newAdmin;
    }
}
