// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./QuestionRepo.sol";

contract CheckAnswer {
    address owner;

    QuestionRepo questionRepo = new QuestionRepo();

    constructor() {
        owner = msg.sender;
    }

    function getScore(
        uint8 _type, 
        uint8 _level, 
        uint256[] calldata _indices, 
        uint8[] calldata _answers
    ) external view returns (uint8) {
        uint8 score = 0;
        for (uint i = 0; i < _answers.length; i++) {
            uint8 standard = questionRepo.getStandardAnswer(_type, _level, _indices[i]);
            if (standard == _answers[i]) {
                score += 1;
            }
        }
        return score;
    }
}
