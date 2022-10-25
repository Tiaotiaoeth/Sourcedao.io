pragma solidity ^0.8.13;

contract QuestionRepo {
    struct Question {
        string ipfshash;        // 保存考题的IPFS hash
        uint8 standardAnswer;   // 保存考题的正确答案
        address auther;         // 保存考题的出题人
    }

    mapping(uint8 => mapping(uint8 => Question[])) questions;       

    event AddQuestion(address indexed sender, uint8 type, uint8 level);
    event SelectQuestion(address indexed sender);

    constructor() {
        owner = msg.sender;
    }

    // 添加试题，目前只能增加
    function addQuestion(
        address _author, 
        uint8 _type, 
        uint8 _level, 
        string _ipfshash, 
        uint8 _standardAnswer
    ) public {
        require(owner == msg.sender);
        questions[_type][_level].push(Question(_ipfshash, _standardAnswer, _author));

        emit AddQuestion(_author, _type, _level);
    }

    // TODO：边界检查
    function randQuestionHash(uint8 _type, uint8 _level) public returns (uint256, string) {
        uint256 length = questions[_type][_level].length;
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, now)));
        uint256 index = random % length;
        return (index, questions[_type][_level][index]._ipfshash);

        emit SelectQuestion(questions[_type][_level][index]._author);
    }

    function getStandardAnswer(uint8 _type, uint8 _level, uint256 _index) public returns (uint8) {
        return questions[_type][_level][index]._standardAnswer;
    }
}
