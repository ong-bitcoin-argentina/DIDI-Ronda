pragma solidity >=0.4.21;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Ronda.sol";

contract RondasRegistry is Ownable {
    
    struct RondaInstance {
        string id;
        address instance;
        bool active;
        bool exists;
    }

    mapping(string => RondaInstance) rondas;

    /**
     * @dev receives the ronda id and the address of the ronda's admin
     */
    function newRonda(string memory _id, address _admin) onlyOwner() public {
        require(!rondas[_id].exists, "La ronda no debe existir para crearla");
        
        // we create the ronda instance
        Ronda ronda = new Ronda(_admin);
        // add the contract instance to our rondas collection
        rondas[_id].id = _id;
        rondas[_id].instance = address(ronda);
        rondas[_id].active = true;
        rondas[_id].exists = true;
    }

    /**
     * @dev get ronda data by id
     */
    function getRondaById(string memory _id) public view returns (string memory, address, bool) {
        return (rondas[_id].id, rondas[_id].instance, rondas[_id].active);
    }

    /**
     * @dev checks if the ronda id exists
     */
    function rondaExists(string memory _id) public view returns (bool) {
        return rondas[_id].exists;
    }

}
