(async () => {
    try {
        console.log('Running batch add repo script...');
    
        //// 初始化题库合约
        let contractName = 'QuestionRepo'
        let constructorArgs = []
        let artifactsPath = `browser/contracts/artifacts/${contractName}.json`    
        let metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
        let signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()
        let factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer);    
        
        let repo = await factory.attach('0xFb25e72d186fdEbcBE3ee78D86316df295823f99');
        await repo.deployed()
        console.log('question repo deployed at:'+ repo.address);

        /*
        function batchAddQuestions(
            address _author,
            uint8 _type,
            uint8 _level,
            string[] memory _ipfshash,
            uint8[] memory _standardAnswer
        )*/
        const author = '';
        const lv3Quests = ["QmPW7xZ2ymKj9eJv4PcGuxtQcQyHfRS23viGztCPHyEV9i",  
            "QmQ6BUctNfMXVV29v5pXdtnqg7z2HirvWfzgp8rKFvaNru",  
            "QmThxuFUXLgsScEfSSwH5rGBBxgSSct96jUEqU3rHCaNiE",  
            "QmP8NU8z4qpZPVUXYRaQBEn5sPHRAoWhSRDhFrk5MhTR6w",  
            "QmYD8xoV68wPfaieJJL9xx4CZMpN1q9oLZAPpygXzKp1WT",  
            "QmV1Y1jzrBDv36mxLVMHo9fMrgEzZE1cRJcuNp3fWJ9vSQ",  
            "QmRQwSzbywm4eU2DwGkR4qLJ2S93sbRnFUgvqBsk8nA8NB",  
            "QmdT4N9stU1qNpVTr9u2ofek162WvwHQrKg38LyixGzPUT",  
            "QmNM4YircDn9UKGYAnrD8poZrbLUtT1wqqoHcAG9GRHzT9",  
            "QmVRzHDjHCduQj7fKLCqeYQ5c5kvyXKAMe4cB7qj9NrXnL",  
            "QmQnLrS46njYz4eLn9e1RgiccjpsBLFb3iDwcqhXL6xELb",  
            "QmVH3RcNkNAjfH2dXi1r2CSTJVwz9RUZyVKh1dosUHKHK9",  
            "QmUBg5GmGp3582JtPuKBwJw5kUBnapjMGALqDAhywNBT9K",  
            "QmaEYQFGUPs3VS52m2T9xEQwxLG2curomBLmawWdQYifZJ"];
        const lv3Answers = [2, 2, 1, 4, 4, 4, 1, 4, 3, 4, 2, 3, 4, 1];
        repo.batchAddQuestions(author, 1, 3, lv3Quests, lv3Answers);

        const lv2Quests = ["QmW1J72SjqJvEfdBLsSsZuzk941zMyEUdMYr7goasq5Cgk", 
            "Qma9xvwf2knwUd8TCowfZUuAhWU1W7weeTeFmWccm1jkGj", 
            "QmbHJm9YX5WBZAQqBhBkEVu4PfLs11pskVzNb3zeVQ9S14", 
            "QmRatCVatdYBiyiWxeevGoPeiYQYCTYe5QGcZRsx2FyNQ3", 
            "QmQDaePyFhiWbzA6T4YsVbZhX937bun7Un4JYBhuJXbT6H", 
            "QmZ3U69AH1ptgaCMUFiUF9w9tTJxtvqcUyhsYAkM3Mtd3b", 
            "QmTWUZya6kPPHzhshFsBWefsKNXnt7kEeeJqKYr1nrescT", 
            "QmU12E8U8wucxZoCEhVowffVVtFCgzQthzQMQAvgUYehRx", 
            "QmXqCzed7RdUfENob9FuDDNdkeYuauW38Jy5W45NrAcDFd", 
            "QmQc66cuP24eqEcPjwn5jBrEXu6rx31hzL81qCzDBtHCxv", 
            "QmboWDWmv1jPuNpHwJLLMdTVv6d3eBmpGNykPCCprWPEFK", 
            "QmYcgMK3sk6RrPpsST1hp7pWUDeppFfBk39MH34S2inWAj", 
            "QmcRsnZ8j76CNx7b8dQkEsSBqj2XHKuwP7TgpJKH8JzmWd", 
            "QmcVXT8SmRAuMhMNfXxdCkpFKSFc7DZhVVaVFpFwU26bat"];
        const lv2Answers = [2, 2, 4, 4, 3, 2, 2, 2, 4, 1, 1, 1, 3, 3];
        repo.batchAddQuestions(author, 1, 2, lv2Quests, lv2Answers);

        const lv1Quests = ["QmXzwzyiAaCxoSBHqSkicmRPMQYh1tYiX9Dm3CFSuUxiTL", 
            "QmXQ1R77LXxEoqpue3NCxRfGHRZo9jX4BbwxjjfR34aU4h", 
            "QmV9jcG8m1Ff9M2WReiWGEQ9kvZoGWWjK9Jh3KguB2xuQ2", 
            "QmTfGihQT6dXYoHRhDLu9iq8x6b9xGtHTmWkBpMkwffpM3", 
            "QmdPtjWCda6AqkJcZkAobpWRgZoegZZciVNF8FUHcWVMUi", 
            "QmbeDB59W9fC3TfW1UyiEJeia7jRLvmfk2VR422jVmQ7Xd", 
            "QmV6t51VA6PJLqFqD8vfFWg7Sj8c3n6DSAy5eXXjA9nqeC", 
            "QmXS8LLZiUqPTNJTqBJU5JLUHWwewqRZS5ihyxR89Cbc1V", 
            "QmeSnmzRg8fjxMwVnHtU7GMzSvoM3q7ZDSmKfjmpwaxydX", 
            "QmR5MeGnGj36zkZ85aGwy29oi5QfMhY9RtG9K6bYNjCiyd", 
            "QmdpSZywq54WqiHUaEBYwW1vuVgxWWE8q38GB7FNTX24xZ", 
            "QmYqwGvbRGjetUGStNkQeDGaeucHZEdZptoan9CUVQUbpc", 
            "QmdzQU3ssoSR6rRMx9E8gLGVCJAKrmsRJ4FHbrnbNEeHFo", 
            "QmWdu8a2vSddNCBcH3bDzKKi2mmvi3t3gLLyGGUDmkFFZY", 
            "QmQY4v9ZVmQJN7sBUNbWLxB2WLi5MamjfwtJbbrE7sRj7h", 
            "Qmb2YNUL7dJQdfLp82YJjkCFGGSCUxPtN633r7q1FyCQHb", 
            "QmPAp3BaoWRBw2V68u77v6LrbMEidyTProZiK2E7GUKPW4", 
            "QmZFywBQ2AdtZJ8psaMzWVjxCRAqGYSQ2V3dyv7dr5zmoL", 
            "QmU9edQxZwXok6owvDXSjnWz9Fivdh9tYAMHe7Rk7wEKHd"];
        const lv1Answers = [2, 3, 4, 3, 4, 4, 3, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 4, 4];
        repo.batchAddQuestions(author, 1, 1, lv1Quests, lv1Answers);

        console.log('Batch add successful.')
    } catch (e) {
        console.log(e.message)
    }
})()