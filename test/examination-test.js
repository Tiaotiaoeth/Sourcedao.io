const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Examination", function () {
  it("test generate examination", async function () {
    let question_type = 1;  // 考试类型
    let question_level = 2; // 考试难度
    let exam_size = 8;  // 一次考试的试题数量

    // 初始化QuestionRepo合约
    const QuestionRepo = await ethers.getContractFactory("QuestionRepo");
    const repo = await QuestionRepo.deploy();
    await repo.deployed();

    console.log('question repo deployed at:'+ repo.address)

    let author_addr = "0x85816b4b42dF81E8Fe694fE34B841eB03F602893";
    for (var i = 1; i < 20; i++) {
      // 添加试题
      var question_hash = "q" + i;
      await repo.addQuestion(author_addr, question_type, question_level, question_hash, i);
    }

    const Examination = await ethers.getContractFactory("Examination");
    const exam = await Examination.deploy();
    await exam.deployed();
    // 设置题库合约地址
    //await exam.setQuestionRepo("0xcD6a42782d230D7c13A74ddec5dD140e55499Df9");
    await exam.setQuestionRepo(repo.address);

    console.log('Examination deployed at:'+ exam.address)

    await exam.setSizeMap(question_type, question_level, exam_size);

    // 生成试卷
    var examId = "test_exam";
    await exam.genExam(examId, question_type, question_level);

    var questions = await exam.getExam(examId);
    console.log("exam: ", questions);

  });
});
