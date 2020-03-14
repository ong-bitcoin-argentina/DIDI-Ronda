pragma solidity >=0.4.21;

contract Ronda {
    
    address admin; 	// ronda admin
    uint startDate;		// start date of the ronda

    enum ParticipantState {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    struct RondaParticipant {
        address participant;	// address of the ronda participant
        uint acceptedMoment; 	// block number of the moment the participant accepted to be part of the ronda
        ParticipantState state;
        uint number;			// the number/position of the participant in the Ronda. uint or array?
        address madeBy;         // who made the action of reject or accept?
        bool exists;
    }

    // stores all the participants
    mapping(address => RondaParticipant) participants;

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    modifier onlyAdmin() {
        require(isAdmin(), "Is not admin!");
        _;
    }

    constructor(address _admin) public {
        admin = _admin;
    }

    function addParticipant(address _participantAddr) public onlyAdmin()  {
        require(!participants[_participantAddr].exists, "The participant is already present on the ronda");
        
        participants[_participantAddr].participant = _participantAddr;
        participants[_participantAddr].state = ParticipantState.PENDING;
        participants[_participantAddr].exists = true;
    }

    function acceptInvitationToParticipate() public {
        require(participants[msg.sender].exists, "The participant doesn't exists");
        require(participants[msg.sender].participant == msg.sender, "Only the participant can call this function");
        require(participants[msg.sender].state == ParticipantState.PENDING, "The participant state must be pending");

        participants[msg.sender].state = ParticipantState.ACCEPTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;
    }

    function rejectInvitationToParticipate() public {
        require(participants[msg.sender].exists, "The participant doesn't exists");
        require(participants[msg.sender].participant == msg.sender, "Only the participant can call this function");
        require(participants[msg.sender].state == ParticipantState.PENDING, "The participant state must be pending");

        participants[msg.sender].state = ParticipantState.REJECTED;
        participants[msg.sender].acceptedMoment = block.number;
        participants[msg.sender].madeBy = msg.sender;
    }

    function start() public onlyAdmin() {
        require(startDate == 0, "The ronda can't be already started");

        startDate = block.number;
    }

    function acceptInvitationByAdmin(address _participant) public onlyAdmin() {
        require(participants[_participant].exists, "The participant doesn't exists");
        require(participants[_participant].state == ParticipantState.PENDING, "The participant state must be pending");

        participants[_participant].state = ParticipantState.ACCEPTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;
    }

    function rejectInvitationByAdmin(address _participant) public {
        require(participants[_participant].exists, "The participant doesn't exists");
        require(participants[_participant].state == ParticipantState.PENDING, "The participant state must be pending");

        participants[_participant].state = ParticipantState.REJECTED;
        participants[_participant].acceptedMoment = block.number;
        participants[_participant].madeBy = msg.sender;
    }

}
