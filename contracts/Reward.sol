// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CheckAnswer.sol";
import "./SBT.sol";

contract Reward is Ownable {
    struct SourceDaoReward {
        // 基础信息
        string org;     // 颁发机构
        uint time;      // 颁发时间，使用区块时间
        // 区块链信息
        string chain;       // 区块链
        string protocol;    // 协议
        address contractAddr;   // 合约地址
        uint256 id;         // SBT id

        uint8 qlevel;       // 考试的难度
        uint8 qtype;        // 考试的类型
        uint8 qsize;        // 试题数量
        uint qduration;     // 考试时长，分钟
        uint lowCost;       // 考试门槛，10E-6
        string costUnit;    // 考试费用单位
        uint16 score;       // 考试分数
        address owner;      // 考试人
        string examId;      // 试卷ID
        string picContent;  // 图片内容，例如IPFS hash
    }

    mapping(uint8 => mapping(uint8 => uint8)) passLines;
    // 每个SBT的元信息
    mapping(uint256 => SourceDaoReward) tokenIdToRewardMeta;
    // 每个预mint SBT的元信息
    mapping(string => SourceDaoReward) examIdToPreRewardMeta;
    // 每次考试最多获得一枚SBT
    mapping(string => uint256) examIdToTokenId;
    // 每个用户钱包地址获得的SBT列表
    mapping(address => uint256[]) balanceList;

    using Counters for Counters.Counter;
    // 有效的tokenId从1开始
    Counters.Counter private idCounter;

    CheckAnswer checker;
    SBT sbt;

    event SetCheckAnswer(address checkerAddr);
    event SetSBTContract(address sbtAddr);
    event RewardEvent(address indexed sender, uint8 qtype, uint8 qlevel, uint8 score, bool pass);


    function setSBTContract(address sbtAddr) external onlyOwner {
        sbt = SBT(sbtAddr);

        emit SetSBTContract(sbtAddr);
    }

    function setCheckAnswer(address checkerAddr) external onlyOwner {
        checker = CheckAnswer(checkerAddr);

        emit SetCheckAnswer(checkerAddr);
    }

    function setPassLine(uint8 _type, uint8 _level, uint8 _score) external onlyOwner {
        passLines[_type][_level] = _score;
    }

    function setDefault(address sbtAddr, address checkerAddr) external onlyOwner {
        sbt = SBT(sbtAddr);
        checker = CheckAnswer(checkerAddr);
        //reward.setPassLine(1, 1, 60);
        passLines[1][1] = 60;
    }
    
    function _mint(string memory _examId, uint8 _type, uint8 _level, uint8 score) private {
        idCounter.increment();
        uint256 tokenId = idCounter.current();

        examIdToTokenId[_examId] = tokenId;
        SourceDaoReward storage r = tokenIdToRewardMeta[tokenId];
        r.org = "SourceDAO";
        r.time = block.timestamp;
        
        r.chain = "Polygon";
        r.protocol = "ERC-721";
        r.contractAddr = address(this);
        r.id = tokenId;

        r.qlevel = _level;
        r.qtype = _type;
        r.qsize = checker.getQuestionSize(_examId);
        r.qduration = checker.getExaminationDurationDelegate(_type, _level);
        r.lowCost = 10000;
        r.costUnit = "MATIC";
        r.score = score;
        r.owner = msg.sender;
        r.examId = _examId;

        sbt.safeMint(msg.sender, tokenId);
        balanceList[msg.sender].push(tokenId);
    }

    function mint(
        string memory _examId, 
        uint8[] calldata _answers,
        uint8 _score,
        uint8 _type, 
        uint8 _level
    ) external {
        require(examIdToTokenId[_examId] == 0, "ExamMintYet");

        checker.setAnswers(_examId, _answers, _score);
        uint8 passLine = passLines[_type][_level];
        require(passLine > 0, "passline");
        if (_score >= passLine) {
            _mint(_examId, _type, _level, _score);
        }
        
        emit RewardEvent(msg.sender, _type, _level, _score, _score >= passLine);
    }

    function checkAndTryReward(
        string memory _examId, 
        uint8[] calldata _answers,
        uint8 _type, 
        uint8 _level
    ) external {
        require(examIdToTokenId[_examId] == 0, "ExamMintYet");
        
        checker.check(_examId, _answers);
        uint8 score = checker.getScore(_examId);
        uint8 passLine = passLines[_type][_level];
        require(passLine > 0, "passline");
        if (score >= passLine) {
            _mint(_examId, _type, _level, score);
        }
        
        emit RewardEvent(msg.sender, _type, _level, score, score >= passLine);
    }

    function setSBTPicContent(uint256 _tokenId, string memory content) external {
        SourceDaoReward storage r = tokenIdToRewardMeta[_tokenId];
        require(bytes(r.picContent).length == 0, "PicContentSetYet");
        require(bytes(content).length > 0, "PicContentErr");

        r.picContent = content;
    }

    // 查询SBT的元信息
    function getSBTMeta(uint256 _tokenId) public view returns (SourceDaoReward memory) {
        return tokenIdToRewardMeta[_tokenId];
    }

    function getSBTMetaByExam(string memory _examId) external view returns (SourceDaoReward memory) {
        uint256 _tokenId = getTokenId(_examId);
        return getSBTMeta(_tokenId);
    }

    // 查询考试的SBT id
    function getTokenId(string memory _examId) public view returns (uint256) {
        require(examIdToTokenId[_examId] > 0, "NoSBT");
        
        return examIdToTokenId[_examId];
    }

    // 查询一个用户获得的所有SBT id列表
    function getTokensByUser(address user) external view returns (uint256[] memory) {
        return balanceList[user];
    }

    // 预生成SBT，应当删掉
    function prefetchSBTMetaByExam(
        string memory _examId, 
        uint8 _type, 
        uint8 _level
    ) external {
        idCounter.increment();
        uint256 tokenId = idCounter.current();

        //examIdToTokenId[_examId] = tokenId;
        SourceDaoReward storage r = examIdToPreRewardMeta[_examId];
        r.org = "SourceDAO";
        r.time = block.timestamp;
        
        r.chain = "Polygon";
        r.protocol = "ERC-721";
        r.contractAddr = address(this);
        r.id = tokenId;

        r.qlevel = _level;
        r.qtype = _type;
        r.qsize = checker.getQuestionSize(_examId);
        r.qduration = checker.getExaminationDurationDelegate(_type, _level);
        r.lowCost = 10000;
        r.costUnit = "MATIC";
        //r.score = score;
        r.owner = msg.sender;
        r.examId = _examId;

        //sbt.safeMint(msg.sender, tokenId);
        //balanceList[msg.sender].push(tokenId);
    }

    // 更新预生成的SBT，应当删掉
    function postSBTMetaByExam(
        string memory _examId, 
        uint8 _score, 
        string memory _picContent
    ) external {
        require(bytes(_picContent).length > 0, "PicContentErr");

        
        SourceDaoReward storage r = examIdToPreRewardMeta[_examId];
        r.score = _score;
        r.picContent = _picContent;
        uint256 _tokenId = r.id;
        examIdToTokenId[_examId] = _tokenId;
        tokenIdToRewardMeta[_tokenId] = r;

        sbt.safeMint(msg.sender, _tokenId);
        balanceList[msg.sender].push(_tokenId);
    }

    function getPreSBTMetaByExam(string memory _examId) external view returns (SourceDaoReward memory) {
        return examIdToPreRewardMeta[_examId];
    }
}
