const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CheckAnswer", function () {
  it("test get score", async function () {
    let question_type = 1;  // 考试类型
    let question_level = 2; // 考试难度
    let exam_size = 8;  // 一次考试的试题数量
    let examId = "test_exam"; // 考试的ID，每次考试必须使用不同的ID

    //// 初始化题库合约
    const QuestionRepo = await ethers.getContractFactory("QuestionRepo");
    const repo = await QuestionRepo.deploy();
    await repo.deployed();
    console.log('question repo deployed at:'+ repo.address)

    // 设置不能难度题目的分值
    await repo.setLevelScore(question_level, 5);
    // 题目作者
    let author_addr = "0x85816b4b42dF81E8Fe694fE34B841eB03F602893";
    for (var i = 1; i < 20; i++) {
      // 添加试题，每个题目必须有唯一的hash，可以使用IPFS hash
      var question_hash = "q" + i;
      await repo.addQuestion(author_addr, question_type, question_level, question_hash, 1 + i % 4);
    }

    var ls = await repo.getScore("q1");
    console.log("level score:" + ls);

    //// 初始化试卷合约
    const Examination = await ethers.getContractFactory("Examination");
    const exam = await Examination.deploy();
    await exam.deployed();
    console.log('Examination deployed at:'+ exam.address)

    // 设置题库合约地址
    await exam.setQuestionRepo(repo.address);
    // 设置不同难度试卷的题目数量
    await exam.setSizeMap(question_type, question_level, exam_size);
    // 生成试卷
    await exam.genExam(examId, question_type, question_level);
    // 获取试卷，返回的是IPFS hash，试题内容要去IPFS取
    var questions = await exam.getExam(examId);
    console.log("exam: ", questions);

    //// 初始化阅卷合约
    const CheckAnswer = await ethers.getContractFactory("CheckAnswer");
    const checker = await CheckAnswer.deploy();
    await checker.deployed();
    console.log('CheckAnswer deployed at:'+ checker.address)
    // 设置题库和试卷合约地址
    checker.setQuestionRepo(repo.address);
    checker.setExamination(exam.address);
    // 计算分数，answers是答案
    var answers = [2, 2, 2, 2, 2, 2, 2, 2];
    var totalScore = await checker.getScore(examId, answers);
    console.log("total score:" + totalScore);
  });
});
