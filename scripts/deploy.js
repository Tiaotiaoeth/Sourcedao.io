(async () => {
    try {
        console.log('Running deployWithEthers script...')
    
        //// 初始化题库合约
        const QuestionRepo = await ethers.getContractFactory("QuestionRepo");
        const repo = await QuestionRepo.deploy();
        await repo.deployed();
        console.log('question repo deployed at:'+ repo.address)

        // 设置不能难度题目的分值
        // await repo.setLevelScore(question_level, 5);

        //// 初始化试卷合约
        const Examination = await ethers.getContractFactory("Examination");
        const exam = await Examination.deploy();
        await exam.deployed();
        console.log('Examination deployed at:'+ exam.address)

        // 设置题库合约地址
        await exam.setQuestionRepo(repo.address);
        // 设置不同难度试卷的题目数量
        //await exam.setSizeMap(question_type, question_level, exam_size);
        // 添加考试类型
        await exam.addExaminationType(1, "通识类");
        // 添加考试难度
        await exam.addExaminationLevel(1, "初级");
        await exam.addExaminationLevel(2, "中级");
        await exam.addExaminationLevel(3, "高级");
        // 设置考试时长
        const examMinutes = 20;
        await exam.setExaminationDuration(1, 2, examMinutes);
        
        //// 初始化阅卷合约
        const CheckAnswer = await ethers.getContractFactory("CheckAnswer");
        const checker = await CheckAnswer.deploy();
        await checker.deployed();
        console.log('CheckAnswer deployed at:'+ checker.address)
        
        // 设置题库和试卷合约地址
        checker.setQuestionRepo(repo.address);
        checker.setExamination(exam.address);

        //// 初始化SBT合约
        const SBT = await ethers.getContractFactory("SBT");
        const sbt = await SBT.deploy("name", "st", "");
        await sbt.deployed();
        console.log('SBT deployed at:'+ sbt.address)

        /// 初始化Reward合约
        const Reward = await ethers.getContractFactory("Reward");
        const reward = await Reward.deploy();
        await reward.deployed();
        console.log('Reward deployed at:'+ reward.address)
        
        // 设置合约地址
        reward.setSBTContract(sbt.address);
        reward.setCheckAnswer(checker.address);
        // 设置及格线，测试用例：不及格，没有SBT
        const passLine = 100;
        reward.setPassLine(question_type, question_level, passLine);
        reward.checkAndTryReward(examId, answers, question_type,  question_level);

        console.log('Deployment successful.')
    } catch (e) {
        console.log(e.message)
    }
})()