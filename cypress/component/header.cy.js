import Header from '../../src/components/Header/index';

it('header shows search bar and title', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = ''
    const title = 'Fake Stack Overflow'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder')
    cy.get('.title').contains(title)
})

it('search bar shows search text entered by user', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').should('have.value', searchQuery)
    cy.get('#searchBar').should('have.attr', 'placeholder');
    cy.get('#searchBar').clear()
    cy.get('#searchBar').type('Search change')
    cy.get('#searchBar').should('have.value', 'Search change')
})

it('set question page called when enter is pressed in search', () => {
    const setQuesitonPageSpy = cy.spy().as('setQuesitonPageSpy')
    const searchQuery = 'test search'
    cy.mount(<Header 
                search={searchQuery} 
                setQuesitonPage={setQuesitonPageSpy}/>)
    cy.get('#searchBar').type('{enter}')
    cy.get('@setQuesitonPageSpy').should('have.been.calledWith', searchQuery, 'Search Results')
})