// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./CheckAnswer.sol";

contract Reward {
    address owner;
    mapping(uint8 => mapping(uint8 => uint8)) passLines;

    CheckAnswer checker = new CheckAnswer();

    event RewardEvent(address indexed sender, uint8 qtype, uint8 qlevel, uint8 score, bool pass);

    constructor() {
        owner = msg.sender;
    }

    function setPassLine(uint8 _type, uint8 _level, uint8 _score) external {
        require(owner == msg.sender);
        passLines[_type][_level] = _score;
    }

    function getReward(
        uint8 _type, 
        uint8 _level, 
        uint256[] calldata _questionIndices, 
        uint8[] calldata _answers
    ) public {
        require(_questionIndices.length == _answers.length);

        uint8 score = checker.getScore(_type, _level, _questionIndices, _answers);
        uint8 passLine = passLines[_type][_level];
        if (score >= passLine) {
            mint(user, _type, _level, score);
        }
        
        emit RewardEvent(msg.sender, _type, _level, score, score >= passLine);
    }
}
