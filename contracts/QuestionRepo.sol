// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract QuestionRepo {
    struct SourceQuestion {
        string ipfshash;        // 保存考题的IPFS hash
        uint8 standardAnswer;   // 保存考题的正确答案
        address author;         // 保存考题的出题人
    }

    address owner;
    mapping(uint8 => mapping(uint8 => SourceQuestion[])) questions;       

    event AddQuestion(address indexed sender, uint8 qtype, uint8 qlevel);
    event SelectQuestion(address indexed sender);

    constructor() {
        owner = msg.sender;
    }

    // 添加试题，目前只能增加
    function addQuestion(
        address _author, 
        uint8 _type, 
        uint8 _level, 
        string memory _ipfshash, 
        uint8 _standardAnswer
    ) public {
        require(owner == msg.sender);
        questions[_type][_level].push(SourceQuestion(_ipfshash, _standardAnswer, _author));

        emit AddQuestion(_author, _type, _level);
    }

    // TODO：边界检查
    function randQuestionHash(uint8 _type, uint8 _level) public returns (uint256, string memory) {
        uint256 length = questions[_type][_level].length;
        uint256 random = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        uint256 index = random % length;

        emit SelectQuestion(questions[_type][_level][index].author);
        
        return (index, questions[_type][_level][index].ipfshash);
    }

    function getStandardAnswer(uint8 _type, uint8 _level, uint256 _index) public view returns (uint8) {
        return questions[_type][_level][_index].standardAnswer;
    }
}
