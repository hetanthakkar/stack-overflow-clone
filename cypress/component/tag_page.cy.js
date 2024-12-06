import Tag from '../../src/components/Main/tagPage/tag';
import TagPage from '../../src/components/Main/tagPage'
// Tag Component
it('Rendering Tag Component', () => {
    const tag = {tid : 1, name : 'Sample Tag '}
    const getQuestionCountByTag = (id) => id
    const clickTag = (name) => console.log('Clicked on clickTag '+name)
    
    cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy');
    });  
    
    cy.mount(<Tag 
        t={tag} 
        getQuestionCountByTag={getQuestionCountByTag}
        clickTag={clickTag}
        />)
    cy.get('.tagNode > .tagName').contains(tag.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag.name + getQuestionCountByTag(tag.tid) + ' questions');
      })
})

// Tag Page Component
it('Rendering Tag Page Component', () => {
    const tag1 = {tid : 1, name : 'Sample Tag 1'}
    const tag2 = {tid : 2, name : 'Sample Tag 2'}
    const tlist = [tag1, tag2]
    const getQuestionCountByTag = (id) => id
    const clickTag = (name) => console.log('Clicked on clickTag '+name)
    const onClickText = 'Ask a question'
    const handleNewQuestion = () => console.log(onClickText)
    cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy');
    });  
    
    cy.mount(<TagPage 
        tlist={tlist} 
        getQuestionCountByTag={getQuestionCountByTag}
        clickTag={clickTag}
        handleNewQuestion = {handleNewQuestion}/>)
    cy.get('.bold_title').contains(tlist.length + ' Tags')
    cy.get('.bluebtn').click()
    cy.get('@consoleLogSpy').should('have.been.called');
    cy.get('@consoleLogSpy').then(consoleLogSpy => {
      expect(consoleLogSpy).to.have.been.calledWith(onClickText);
    });
    cy.get('.tagNode > .tagName').contains(tag1.name)
    cy.get('.tagNode > .tagName').contains(tag2.name)
    cy.get('div.tagNode').invoke('text').then((text) => {
        expect(text).to.equal(tag1.name + getQuestionCountByTag(tag1.tid) + ' questions' + tag2.name + getQuestionCountByTag(tag2.tid) + ' questions');
      })
})