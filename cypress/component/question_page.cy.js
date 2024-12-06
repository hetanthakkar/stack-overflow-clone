import QuestionObj from '../../src/models/question';
import QuestionHeader from '../../src/components/Main/questionPage/header';
import OrderButton from '../../src/components/Main/questionPage/header/orderButton';
import Question from '../../src/components/Main/questionPage/question';
import Answer from '../../src/models/answer';

// Question Page - Order Button
it('Rendering Order Button', () => {
    const message = 'Test Message'
    const setQuestionOrderSpy = cy.spy('').as('setQuestionOrderSpy')
    
    cy.mount(<OrderButton 
        message={message} 
        setQuestionOrder={setQuestionOrderSpy}/>)
     cy.get('.btn').click()
     cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message);

})

// Question Page - Header Component
it('Rendering Question Header', () => {
    const title = 'Sample Title'
    const count = 1
    // const newQuestionButton = 'Add a new question'
    const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy')
    const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy')
    
    cy.mount(<QuestionHeader 
        title_text={title} 
        qcnt = {count}
        setQuestionOrder={setQuestionOrderSpy}
        handleNewQuestion={handleNewQuestionSpy}/>)

    cy.get('.bold_title').contains(title)
    cy.get('.bluebtn').click()
    cy.get('@handleNewQuestionSpy').should('have.been.called');
    // cy.get('@consoleLogSpy').then(consoleLogSpy => {
    //   expect(consoleLogSpy).to.have.been.calledWith(newQuestionButton);
    // });
    cy.get('#question_count').contains(count + ' questions')
    cy.get('.btns .btn').eq(0).should('have.text', 'Newest');
    cy.get('.btns .btn').eq(1).should('have.text', 'Active');
    cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered');
    cy.get('.btns .btn').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text());
    })
})

// Question Body
it('Rendering Question Body', () => {
    const answers = []
    for(let index= 1; index <= 2; index++){
        var newanswer = {
            aid: index,
            text: 'Sample Answer Text '+index,
            ansBy: 'sampleanswereduser'+index,
            ansDate: new Date(),
        };
        answers.push(new Answer(newanswer))
    }

    let question = {
        qid: 1212,
        title: 'Sample Question Title',
        text: 'Sample Question Text',
        askedBy: 'vanshitatilwani',
        askDate: new Date('Jan 17, 2024 03:24'),
        views : 150,
        ansIds : answers.map(answer => answer.aid),
        tagIds: [1,2]
    };

    const handleAnswerSpy = cy.spy().as('handleAnswerSpy')
    const app = {
        getTagByIdSpy: (tid) => {
            return {tid: tid,name: `Sample Tag ${tid}`}
        }
    } 
    const getTagByIdSpy =  cy.spy(app, 'getTagByIdSpy').as('getTagByIdSpy')
    
    cy.mount(<Question 
        q={new QuestionObj(question)} 
        getTagById={getTagByIdSpy}
        handleAnswer={handleAnswerSpy}/>)

    cy.get('.postTitle').contains(question.title)
    cy.get('.postStats').contains(answers.length + ' answers')
    cy.get('.postStats').contains(question.views + ' views')
    cy.get('@getTagByIdSpy').should('have.been.calledWith', question.tagIds[0])
    cy.get('@getTagByIdSpy').should('have.been.calledWith', question.tagIds[1])
    cy.get('.question_tags .question_tag_button').contains('Sample Tag 1')
    cy.get('.question_tags .question_tag_button').contains('Sample Tag 1')
    cy.get('.lastActivity .question_author').contains(question.askedBy)
    cy.get('.lastActivity .question_meta').contains('asked Jan 17 at 03:24')
    cy.get('.question').click()
    cy.get('@handleAnswerSpy').should('have.been.calledWith', question.qid)
})