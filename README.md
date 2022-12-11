# SourceDAO.io

The project of SourceDAO.

## 合约接口

### 考试流程
1. 生成试卷：调用Examination.sol合约的genExam(string _examId, uint8 _type, uint8 _level)，其中_examId是试卷的唯一全局ID，此ID由前端构造，每张试卷必须不同。_type和_level分别是考试类型和考试难度，例如通识类考试的_type=1，考试难度_level取值1,2或3，数值越大难度越高。如果合约调用成功，可以执行下一步。

2. 获取试卷：调用Examination.sol合约的getExam(string _examId) returns (string[])，传入上一步的_examId，合约执行成功会返回一个字符串数组，数组的每一项都是一个IPFS hash，根据这个hash值可以从IPFS文件系统获取考试题目（json格式）。

3. 获取考试时长：调用Examination.sol的getExaminationDuration(uint8 qtype, uint8 qlevel) returns (uint16)，参数qtype和qlevel分别是考试类型和考试难度，返回值是考试时长，单位为分钟。

4. 阅卷：通过前三步，前端可以生成试卷，用户考完后，通过Reward.sol的checkAndTryReward(string _examId, uint8[] _answers, uint8 _type, uint8 _level)，参数_examId是试卷的唯一全局ID，_answers是用户提交的答案，_type和_level分别是考试类型和考试难度。注：_answers是uint8类型的数组，1、2、3、4分别对应选择题的A、B、C、D四个选项，0代表用户没有答题。

5. 查询考试结果：第4步合约成执行后，可以调用Reward.sol的getSBTMetaByExam(string _examId)，参数_examId是试卷的唯一全局ID。如果考试不及格，则此处调用会失败。如果考试合格，会返回数据结构见Reward.sol定义的struct SourceDaoReward。根据这个SourceDaoReward，前端需要生成SBT图片（如果图片尚未生成）。

6. 查询考过的试卷：需要知道试卷的唯一ID，首先调用Examination.sol合约的getExam(string _examId) returns (string[])获取试题，然后调用CheckAnswer.sol的getAnswers(string _examId) returns (uint8[])获得用户提交的答案。试题和答案分开存储是为了节省链上存储空间，减少gas消耗。

### 遍历类接口

1. 列出所有考试类型：调用Examination.sol合约的listTypes() returns (ExamType[])，返回数据结构ExamType有两个成员，uint8 typeId是考试类型的ID，用于合约函数的参数。string name是考试类型的字符串表示，例如“通识类”，用于前端展示。

2. 列出所有考试难度：调用Examination.sol合约的listLevels() returns (ExamLevel[])，返回数据结构ExamLevel有两个成员，uint8 levelId是考试难度的ID，用于合约函数的参数。string name是考试难度的字符串表示，例如“初级”，用于前端展示。

3. 列出用户（按照钱包地址）获得的所有SBT ids列表：调用Reward.sol的getTokensByUser(address user) returns (uint256[])，参数user是用户的钱包地址，返回SBT ids列表。根据返回的id，调用Reward.sol的getSBTMeta(uint256 _tokenId) returns (SourceDaoReward)可以查询SBT详情。




### 合约设置流程

1. 合约依赖设置：在合约发布后，需要通过传入合约的地址，设置依赖关系。
1.1 Examination.sol -> QuestionRepo.sol：调用Examination.sol的setQuestionRepo(address repoAddr)，传入QuestionRepo.sol的合约地址。
1.2 Reward.sol -> SBT.sol 和 CheckAnswer.sol：分别调用Reward.sol的setSBTContract(address sbtAddr)和setCheckAnswer(address checkerAddr)，参数sbtAddr和checkerAddr分别是SBT.sol的合约地址与CheckAnswer.sol的合约地址。
1.3 CheckAnswer.sol -> QuestionRepo.sol 和 Examination.sol：分别调用CheckAnswer.sol的setQuestionRepo(address repoAddr)和setExamination(address examAddr)，参数repoAddr和examAddr分别是QuestionRepo.sol的合约地址与Examination.sol的合约地址。

2. 考试参数设置，重复调用可以覆盖之前的设置。
2.1 设置考试时长：调用Examination.sol的setExaminationDuration(uint8 qtype, uint8 qlevel, uint16 minutes)，参数qtype和qlevel分别是考试类型和考试难度，minutes是考试时间，单位是分钟。
2.2 设置考题数量：调用Examination.sol的setSizeMap(uint8 qtype, uint8 qlevel, uint size)，参数qtype和qlevel分别是考试类型和考试难度，size是考题数量。
2.3 设置考试及格线：调用Reward.sol的setPassLine(uint8 type, uint8 level, uint8 score)，参数type和level分别是考试类型和考试难度，score是及格线，百分制。
2.4 设置不同难度试题的分数：调用QuestionRepo.sol的setLevelScore(uint8 _level, uint8 _score)，参数_level是试题难度ID，_score是该难度试题的分值。


### 数据上链

1. 增加考试类型：调用Examination.sol的addExaminationType(uint8 qtype, string name)，添加一种考试类型，qtype是考试类型的ID，name是考试类型的字符串表示。
2. 增加考试难度：调用Examination.sol的addExaminationLevel(uint8 qlevel, string name)，添加一种考试难度，qlevel是考试难度的ID，name是考试难度的字符串表示。
3. 增加试题：调用QuestionRepo.sol的addQuestion(address _author, uint8 _type, uint8 _level, string _ipfshash, uint8 _standardAnswer)，参数_author是出题者，_type和_level分别是试题类型和试题难度，_ipfshash是试题内容对应的IPFS hash，因为试题内容比较大，所以存储在IPFS文件系统中，链上只保留对应的hash以节省gas。
