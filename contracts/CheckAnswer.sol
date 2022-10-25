pragma solidity ^0.8.13;

contract CheckAnswer {
    address owner;
    address answerRepo;

    constructor() {
        owner = msg.sender;
    }

    function setRepoAddr(address _repoAddr) public {
        require(owner == msg.sender);
        answerRepo = _repoAddr;
    }

    function getScore(address[] questions, uint8[] _answers) external view returns (uint8) {
        uint8 score = 0;
        for (uint i = 0; i < _answers.length; i++) {
            // TODO: get right answer
            if (rightAnswer == _answers[i]) {
                score += 1;
            }
        }
        return score;
    }
}
