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

describe('Auth tests', () => {
  it('Login as normal user', () => {
    cy.loginNormal();
    // page should contain `Dashboard` text
    cy.contains('Dashboard');
  });
});

export {};
