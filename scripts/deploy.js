(async () => {
    try {
        console.log('Running deployWithEthers script by remix...');
    
        //// 初始化题库合约
        let contractName = 'QuestionRepo'
        let constructorArgs = []
        let artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        let metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        let signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        let repo = await factory.deploy(...constructorArgs);
        await repo.deployed()
        let repoAddr = repo.address;
        console.log('question repo deployed at:'+ repoAddr);

        // 设置不同难度题目的分值
        //await repo.setLevelScore(1, 2);     // 初级题目，分值为2
        //await repo.setLevelScore(2, 3);     // 中级题目，分值为3
        //await repo.setLevelScore(3, 5);     // 高级题目，分值为5
        await await repo.setDefault();
        
        //// 初始化试卷合约
        contractName = 'Examination'
        constructorArgs = []
        artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        const exam = await factory.deploy(...constructorArgs);
        await exam.deployed();
        console.log('Examination deployed at:'+ exam.address);

        /*
        // 设置题库合约地址
        await exam.setQuestionRepo(repoAddr);
        // 添加考试类型
        await exam.addExaminationType(1, "通识类");
        // 添加考试难度
        await exam.addExaminationLevel(1, "初级");
        await exam.addExaminationLevel(2, "中级");
        await exam.addExaminationLevel(3, "高级");
        // 设置不同难度试卷的题目数量
        await exam.setSizeMap(1, 1, 20);    // 测试时用20题，正式上线改为100题
        // 设置试卷中不同难度题目的比例
        // setLevelPercent(type, level, hardPct, normalPct, easyPct)
        await exam.setLevelPercent(1, 1, 20, 30, 50);
        // 设置考试时长
        const examMinutes = 20;
        await exam.setExaminationDuration(1, 2, examMinutes);
        */
        await exam.setDefault(repoAddr);
        
        //// 初始化阅卷合约
        contractName = 'CheckAnswer'
        constructorArgs = []
        artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        const checker = await factory.deploy(...constructorArgs);
        await checker.deployed();
        console.log('CheckAnswer deployed at:'+ checker.address);
        
        // 设置题库和试卷合约地址
        //checker.setQuestionRepo(repoAddr);
        //checker.setExamination(exam.address);
        await checker.setDefault(repoAddr, exam.address);

        //// 初始化SBT合约
        contractName = 'SBT'
        constructorArgs = ["name", "st", ""]
        artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        const sbt = await factory.deploy(...constructorArgs);
        await sbt.deployed();
        console.log('SBT deployed at:'+ sbt.address);

        /// 初始化Reward合约
        contractName = 'Reward'
        constructorArgs = []
        artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        const reward = await factory.deploy(...constructorArgs);
        await reward.deployed();
        console.log('Reward deployed at:'+ reward.address);
        
        // 设置合约地址
        //reward.setSBTContract(sbt.address);
        //reward.setCheckAnswer(checker.address);
        // 设置及格线，测试用例：不及格，没有SBT
        //const passLine = 60;
        //reward.setPassLine(1, 1, passLine);
        await reward.setDefault(sbt.address, checker.address);

        // 初始化临时工作流合约
        contractName = 'WorkflowV1'
        constructorArgs = []
        artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        const wl = await factory.deploy(...constructorArgs);
        await wl.deployed();
        console.log("WorkflowV1 deployed at:" + wl.address);

        // 设置合约地址
        //wl.setExamForWorkflow(exam.address);
        //wl.setReward(reward.address);
        await wl.setDefault(exam.address, checker.address, reward.address);
        
        console.log('Deployment successful.')
    } catch (e) {
        console.log(e.message)
    }
})()