pragma solidity ^0.8.13;
import "./CheckAnswer.sol";

contract Reward {
    address owner;
    mapping(uint8 => mapping(uint8 => uint8)) passLines;

    event Reward(address indexed sender, uint8 type, uint8 level, uint8 score, bool pass);

    constructor() {
        owner = msg.sender;
    }

    function setPassLine(uint8 _type, utin8 _level, uint8 _score) public {
        require(owner == msg.sender);
        passLines[_type][_level] = _score;
    }

    function getReward(uint8 _type, uint8 _level, uint256[] _questionIndices, uint8[] _answers) public {
        require(_indices.length == _answers.length);

        uint8 score = getScore(_type, _level, _questionIndices, _answers);
        uint8 passLine = passLines[_type][_level]
        if (score >= passLine) {
            mint(user, _type, _level, score);

        }
        
        emit Reward(msg.sender, _type, _level, score, score >= passLine);
    }
}
