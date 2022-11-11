// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuestionRepo", function () {
  it("test add question", async function () {
    const QuestionRepo = await ethers.getContractFactory("QuestionRepo");
    const repo = await QuestionRepo.deploy();
    await repo.deployed();

    console.log('question repo deployed at:'+ repo.address)

    let question_type = 1;  // 考试类型
    let question_level = 2; // 考试难度
    let author_addr = "0x85816b4b42dF81E8Fe694fE34B841eB03F602893";
    for (var i = 1; i < 4; i++) {
      // 添加试题
      var question_hash = "q" + i;
      const addq1 = await repo.addQuestion(author_addr, question_type, question_level, question_hash, i);
    }
 
    let randSeed = 3;   // 随机数，确保选择
    var qhash = await repo.randQuestion(question_type, question_level, randSeed);
    console.log("selected ipfs hash:" + qhash);
  });
});