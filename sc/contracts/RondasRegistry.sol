pragma solidity >=0.4.21;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Ronda.sol";

contract RondasRegistry is Ownable {
    struct RondaInstance {
        string id; // Ronda ID
        address instance; // Address of the Ronda
        bool active; // If the ronda is active
        bool exists; // If ronda exists or not for internal use
        uint256 finishTime; // Block when ronda finished
    }

    mapping(string => RondaInstance) rondas;

    // Event to trigger when a new ronda is created
    event NewRonda(address indexed _admin, string _id);

    // Event to trigger when a ronda is finished
    event FinishedRonda(string _id, uint256 indexed _finishedTime);


    /**
        @notice receives the ronda id and the address of the ronda's admin
        @dev Only the owner may call this function see {onlyOwner}
        @param _id string Ronda ID
        @param _admin address Address from the Ronda
     */
    function newRonda(string calldata _id, address _admin) external onlyOwner {
        require(!rondas[_id].exists, "Ronda already exists!");

        // we create the ronda instance
        Ronda ronda = new Ronda(_admin, address(this) ,_id);
        // add the contract instance to our rondas collection
        rondas[_id].id = _id;
        rondas[_id].instance = address(ronda);
        rondas[_id].active = true;
        rondas[_id].exists = true;
        rondas[_id].finishTime = 0;

        emit NewRonda(_admin, _id);
    }

    /**
        @notice Function to get ronda data by id
        @param _id string Ronda ID
        @return string Ronda ID
        @return address address of the Ronda
        @return bool If the ronda is active or not
     */
    function getRondaById(string calldata _id)
        external
        view
        returns (
            string memory,
            address,
            bool,
            uint256
        )
    {
        return (rondas[_id].id, rondas[_id].instance, rondas[_id].active, rondas[_id].finishTime);
    }

    /**
        @notice Function that checks if the ronda id exists
        @param _id string Ronda ID
        @return bool 
     */
    function rondaExists(string calldata _id) external view returns (bool) {
        return rondas[_id].exists;
    }

        /**
        @notice Function that checks if the ronda is active
        @param _id string Ronda ID
        @return bool 
     */
    function rondaIsActive(string calldata _id) external view returns (bool) {
        return rondas[_id].active;
    }

    /**
        @notice Function to end a Round
        @param _id string Ronda ID
     */
    function finishRonda(string calldata _id) external onlyOwner {
        require(rondas[_id].exists, "Ronda does not exist!");
        rondas[_id].active = false;
        rondas[_id].finishTime = block.number;
        emit FinishedRonda(_id, block.number);
    }
}
