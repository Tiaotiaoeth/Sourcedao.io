// Copyright (c) Sourcedao
// SPDX-License-Identifier: MIT

module sourcedao_move::question_repo {
    use std::string::{String};
    use std::vector;
    use sui::object::{ID, UID};
    use sui::transfer;
    use sui::tx_context::{TxContext};

    // question data struction
    struct SourceQuestion has key, store {
        id: UID,
        standard_answer: u8,
        score: u8,
        content: String,
        author: String
    }

    struct QuestionRepoOwner has key, store {
        id: UID,
        repo_id: ID
    }

    // question repository
    struct QuestionsOracle has key {
        id: UID,
        type: u8,
        level: u8,
        questions: vector<SourceQuestion>,
    }

    public fun new(type: u8, level: u8, ctx: &mut TxContext): QuestionRepoOwner{
        let id = object::new(ctx);
        let repo_id = object::uid_to_inner(&id);
        let question_repo = QuestionsOracle {id, type, level, vector::empty()};
        transfer::share_object(question_repo);

        QuestionRepoOwner {id: object::new(ctx), repo_id}
    }

    /* create a new repository */
    public entry fun create_repo(type: u8, level: u8, ctx: &mut TxContext): QuestionRepoOwner {
        let owner = new(type, level, ctx);

        transfer::transfer(owner, tx_context::sender(ctx));
    }

    public fun add_question(repo: &mut QuestionsOracle, owner: QuestionRepoOwner,
            author: String, ipfshash: String, standard_answer: u8, score: u8,
            ctx: &mut TxContext) {
        only_owner(repo, owner);

        let id = object::new(ctx);
        let question = SourceQuestion {id, standard_answer, score, content: ipfshash, author };
        vector::push_back(&mut repo.questions, question);
    }

    /*
    function randQuestion(uint8 _type, uint8 _level, uint _seed) external view returns (string memory) {
        uint256 length = questions[_type][_level].length;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, _seed)));
        uint256 index = random % length;
        string memory qhash = questions[_type][_level][index];

        return qhash;
    }*/
    public fun rand_question(repo: &QuestionsOracle): vector<SourceQuestion> {

    }

    public fun get_standard_answer(question: &SourceQuestion): u8 {
        question.standard_answer
    }

    public fun get_score(question: &SourceQuestion): u8 {
        question.score
    }

    fun only_owner(repo: &QuestionsOracle, owner: &QuestionRepoOwner) {
        assert!(object::borrow_id(repo) == &owner.repo_id, ErrOwnerOnly);
    }
}


