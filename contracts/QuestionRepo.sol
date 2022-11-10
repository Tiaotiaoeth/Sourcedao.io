// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";

contract QuestionRepo {
    struct SourceQuestion {
        uint8 standardAnswer;   // 保存考题的正确答案
        string content;         // 保存考题的IPFS hash
        address author;         // 保存考题的出题人
    }

    using Counters for Counters.Counter;
    Counters.Counter private _randSeed;

    address owner;

    mapping(uint8 => mapping(uint8 => string[])) private questions;
    mapping(string => SourceQuestion) private hashToQuestion;

    event AddQuestion(address indexed author, uint8 qtype, uint8 qlevel, string qhash);
    event SelectQuestion(address indexed author, string qhash);

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
    ) public onlyOwner {
        SourceQuestion storage q = hashToQuestion[_ipfshash];
        q.standardAnswer = _standardAnswer;
        q.content = _ipfshash;
        q.author = _author;

        questions[_type][_level].push(_ipfshash);
        emit AddQuestion(_author, _type, _level, _ipfshash);
    }

    // TODO：边界检查
    function randQuestion(uint8 _type, uint8 _level) public returns (string memory) {
        _randSeed.increment();
        uint idx = _randSeed.current();

        uint256 length = questions[_type][_level].length;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, idx)));
        uint256 index = random % length;
        string memory qhash = questions[_type][_level][index];
        SourceQuestion memory q = hashToQuestion[qhash];

        emit SelectQuestion(q.author, qhash);
        return qhash;
    }

    function getStandardAnswer(string memory _qhash) public view returns (uint8) {
        return hashToQuestion[_qhash].standardAnswer;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
