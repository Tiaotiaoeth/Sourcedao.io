pragma solidity ^0.8.13;
import "./QuestionRepo.sol";

contract CheckAnswer {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function getScore(
        uint8 _type, 
        uint8 _level, 
        uint256[] _indices, 
        uint8[] _answers
    ) external view returns (uint8) {
        uint8 score = 0;
        for (uint i = 0; i < _answers.length; i++) {
            uint8 standard = getStandardAnswer(_type, _level, _indices[i]);
            if (standard == _answers[i]) {
                score += 1;
            }
        }
        return score;
    }
}
