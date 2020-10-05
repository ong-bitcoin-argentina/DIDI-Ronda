pragma solidity >=0.4.21;

contract Ronda {
    address admin; // ronda admin
    uint256 startDate; // start date of the ronda
    uint256 currentPayment = 0; // Curent index of the round Payments

    /**
    STATES
    PENDING => Participant did not accept / reject the invitation yet
    ACCEPTED => Participant accepted to take part in the round
    REJECTED => Participant rejected the invitation to participate in the Round
     */
    enum ParticipantState {PENDING, ACCEPTED, REJECTED}

    struct RondaParticipant {
        address participant; // address of the ronda participant
        uint256 acceptedMoment; // block number of the moment the participant accepted to be part of the ronda
        ParticipantState state; // See enum data
        uint256 number; // the number/position of the participant in the Ronda. uint or array?
        address madeBy; // who made the action of reject or accept?
        bool exists;
    }

    struct RondaPayment {
        address participant; // Participant that made the payment
        uint256 doneMoment; // At what moment was done
        uint32 amount; // Amount of the payment
        bool exists;
    }

    // stores all the participants
    mapping(address => RondaParticipant) participants;

    // Store payments
    mapping(uint256 => RondaPayment) payments;

    // Only the admin will pass this check
    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    function participantExists(address _addr) public view returns (bool) {
        return participants[_addr].exists;
    }

    function participantStateIsPending(address _addr)
        public
        view
        returns (bool)
    {
        return participants[_addr].state == ParticipantState.PENDING;
    }

    // Check only for the participant existance
    modifier participantExistsInRound(address _addr) {
        require(participantExists(_addr), "The participant doesn't exists");
        _;
    }

    /**
        Modifier for participant check access
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
        Modifier for admin check access to perform certain operations over a participant
    */
    modifier participantExistsAndIsPending(address _addr) {
        require(participantExists(_addr), "The participant doesn't exists");
        require(
            participantStateIsPending(_addr),
            "The participant state must be pending"
        );
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin(), "Is not admin!");
        _;
    }

    constructor(address _admin) public {
        admin = _admin;
    }

    /**
    Given a certain address, return the participant data related to that address
    Only the admin should use this function
    */
    function getParticipant(address _addr)
        public
        view
        onlyAdmin()
        returns (
            address,
            uint256,
            ParticipantState,
            uint256,
            address,
            bool
        )
    {
        return (
            participants[_addr].participant,
            participants[_addr].acceptedMoment,
            participants[_addr].state,
            participants[_addr].number,
            participants[_addr].madeBy,
            participants[_addr].exists
        );
    }

    /**
        Given an array of addresses (who will be participants) it adds them to the round and stores them
        Participants will be in a pending state until they accept or reject the round invitation
        Only the admin may call this function
     */
    function addParticipants(address[] memory _addresses) public onlyAdmin() {
        for (uint8 i = 0; i < _addresses.length; i++) {
            if (!participants[_addresses[i]].exists) {
                participants[_addresses[i]].participant = _addresses[i];
                participants[_addresses[i]].state = ParticipantState.PENDING;
                participants[_addresses[i]].exists = true;
            }
        }
    }

    /**
        Given an address, add it as a participant to the round, same as the addParticipants but only 1 at a time
        Only the admin may call this function
     */
    function addParticipant(address _participantAddr) public onlyAdmin() {
        require(
            !participants[_participantAddr].exists,
            "The participant is already present on the round"
        );

        participants[_participantAddr].participant = _participantAddr;
        participants[_participantAddr].state = ParticipantState.PENDING;
        participants[_participantAddr].exists = true;
    }

    /**
        A participant may call this function to accept the invitation to a Round.
        The accepted moment will be recorded with the block number
        The participant must exist, be the sender, and be pending in order to accept
     */
    function acceptInvitationToParticipate()
        public
        onlyExistantAndPendingParticipant()
    {
        participants[msg.sender].state = ParticipantState.ACCEPTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;
    }

    /**
        A participant may call this function to REJECT the invitation to a Round.
        The accepted moment will be recorded with the block number
        The participant must exist, be the sender, and be pending in order to accept
     */
    function rejectInvitationToParticipate()
        public
        onlyExistantAndPendingParticipant()
    {
        participants[msg.sender].state = ParticipantState.REJECTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;
    }

    /**
    The admin may call this function to "start" a round and record it start block
    Only the admin may call this function
    */
    function start() public onlyAdmin() {
        require(startDate == 0, "The ronda is already started");

        startDate = block.number;
    }

    /**
        The admin may call this function to accept the invitation to a Round of a participant.
        The accepted moment will be recorded with the block number
        The participant must exist, and be pending in order to accept
        Only the admin may call this function
     */
    function acceptInvitationByAdmin(address _participant)
        public
        onlyAdmin()
        participantExistsAndIsPending(_participant)
    {
        participants[_participant].state = ParticipantState.ACCEPTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;
    }

    /**
        The admin may call this function to reject the invitation to a Round of a participant.
        The accepted moment will be recorded with the block number
        The participant must exist, and be pending in order to accept
        Only the admin may call this function
     */
    function rejectInvitationByAdmin(address _participant)
        public
        onlyAdmin()
        participantExistsAndIsPending(_participant)
    {
        participants[_participant].state = ParticipantState.REJECTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;
    }

    /**
        The admin may call this function to replace a participant in the round
        The old participant address and the new one must be provided for them to be changed
        In case that the round hasn't started, the participant will be in a pending state
        In started rounds it will be automatically accepted
        Only the admin may call this function
     */
    function replaceParticipant(
        address _oldParticipant,
        address _newParticipant
    ) public onlyAdmin() participantExistsInRound(_oldParticipant) {
        participants[_newParticipant].participant = _newParticipant;
        if (startDate == 0) {
            participants[_newParticipant].state = ParticipantState.PENDING;
        } else {
            participants[_newParticipant].state = ParticipantState.ACCEPTED;
        }
        participants[_newParticipant].exists = true;
        participants[_oldParticipant].exists = false;
    }

    /**
        Given an amount, the sender will record a payment with that amount and the block number that was performed on
        Any participant may call this function as long as they exist in the round
     */
    function makePayment(uint32 amount)
        public
        participantExistsInRound(msg.sender)
    {
        currentPayment = currentPayment + 1;
        payments[currentPayment].participant = msg.sender;
        payments[currentPayment].doneMoment = block.number;
        payments[currentPayment].amount = amount;
        payments[currentPayment].exists = true;
    }

    /**
        Allows the admin to inspect the data of a given payment number
        It returns who made it, at waht moment and the amount
        Only the admin may call this function
     */
    function getPayment(uint256 _number)
        public
        view
        onlyAdmin()
        returns (
            address,
            uint256,
            uint32
        )
    {
        require(payments[_number].exists, "The payment doesn't exist");
        return (
            payments[_number].participant,
            payments[_number].doneMoment,
            payments[_number].amount
        );
    }

    /**
        Allows the admin to get the current quantity of payments registered on the Round
        Only the admin may call this function
     */
    function getQuantityOfPayments() public view onlyAdmin() returns (uint256) {
        return currentPayment;
    }
}
