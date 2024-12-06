import NewAnswer from '../../src/components/Main/newAnswer/index';

it('mounts', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput')
    cy.get('#answerTextInput')
    cy.get('.form_postBtn')
})

it('shows error message when both input is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Username cannot be empty')
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows username inputted by user', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput').should('have.value', '')
    cy.get('#answerUsernameInput').type('abc')
    cy.get('#answerUsernameInput').should('have.value', 'abc')
})

it('shows error message when text is empty', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerUsernameInput').type('abc')
    cy.get('.form_postBtn').click()
    cy.get('div .input_error').contains('Answer text cannot be empty')
})

it('shows text inputted by user', () => {
    cy.mount(<NewAnswer/>)
    cy.get('#answerTextInput').should('have.value', '')
    cy.get('#answerTextInput').type('abc')
    cy.get('#answerTextInput').should('have.value', 'abc')
})


it('addAnswer is called when click Post Answer', () => {
    const obj = {
        addAnswer: (arg) => {return arg}
    }
    const handleAnswer = cy.spy().as('handleAnswerSpy')
    cy.spy(obj, 'addAnswer')
    cy.mount(<NewAnswer qid={123} addAnswer={obj.addAnswer} handleAnswer={handleAnswer} />)
    cy.get('#answerUsernameInput').type('usr')
    cy.get('#answerTextInput').type('abc')
    cy.get('.form_postBtn').click().then(
        () => {
            expect(obj.addAnswer).to.be.calledWith(123, {text: 'abc', ansBy: 'usr'}) 
        }
    )
})

it('handleAnswer is called when click Post Answer', () => {
    const obj = {
        addAnswer: (arg) => {return arg}
    }
    const handleAnswer = cy.spy().as('handleAnswerSpy')
    cy.mount(<NewAnswer qid={123} addAnswer={obj.addAnswer} handleAnswer={handleAnswer} />)
    cy.get('#answerUsernameInput').type('usr')
    cy.get('#answerTextInput').type('abc')
    cy.get('.form_postBtn').click()
    cy.get('@handleAnswerSpy').should('have.been.calledWith', 123)
})