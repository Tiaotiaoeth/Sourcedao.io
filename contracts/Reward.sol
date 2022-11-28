// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";
import "./CheckAnswer.sol";
import "./SBT.sol";

contract Reward {
    struct SourceDaoReward {
        uint256 id;         // SBT id
        uint8 level;        // 考试的难度
        uint8 type;         // 考试的类型
        uint16 score;       // 考试分数
        uint8 time;         // 考试时间，使用区块时间
        address owner;      // 考试人
    }

    address owner;
    mapping(uint8 => mapping(uint8 => uint8)) passLines;
    // 每个SBT的元信息
    mapping(uint256 => SourceDaoReward) idToRewardMeta;

    using Counters for Counters.Counter;
    Counters.Counter private idCounter;

    CheckAnswer checker;
    SBT sbt;

    event SetCheckAnswer(address checkerAddr);
    event SetSBTContract(address sbtAddr);
    event RewardEvent(address indexed sender, uint8 qtype, uint8 qlevel, uint8 score, bool pass);

    constructor() {
        owner = msg.sender;
    }

    function setSBTContract(address sbtAddr) external onlyOwner {
        sbt = SBT(sbtAddr);

        emit SetSBTContract(sbtAddr);
    }

    function setCheckAnswer(address checkerAddr) external onlyOwner {
        checker = CheckAnswer(checkerAddr);

        emit SetCheckAnswer(checkerAddr);
    }

    function setPassLine(uint8 _type, uint8 _level, uint8 _score) external {
        require(owner == msg.sender);
        passLines[_type][_level] = _score;
    }

    function checkAndTryReward(
        string memory _examId, 
        uint8[] calldata _answers,
        uint8 _type, 
        uint8 _level, 
    ) external {
        uint8 score = checker.getScore(_examId, _answers);
        uint8 passLine = passLines[_type][_level];
        if (score >= passLine) {
            idCounter.increment();
            uint256 tokenId = idCounter.current();

            SourceDaoReward r = idToRewardMeta[tokenId];
            r.id = tokenId;
            r.level = _level;
            r.type = _type;
            r.score = score;
            r.time = now;
            r.owner = msg.sender;

            sbt.safeMint(msg.sender, tokenId);
        }
        
        emit RewardEvent(msg.sender, _type, _level, score, score >= passLine);
    }

    // 查询SBT的元信息
    function getSBTMeta(uint256 tokenId) external view returns (string) {
        return idToMeta[tokenId];
    }
}
