describe('Main tests', () => {
  it('Page contains correct title', () => {
    cy.visit('/');
    cy.title().should('contain', 'CodeFarem');
  });

  it('Redirected to auth page if not logged in', () => {
    cy.visit('/');
    cy.url().should('contain', '/auth');
  });
});

export {};
