import { MAIL_SERVER_URL } from '../utils/constants';

Cypress.Commands.add('loginNormal', () => {
  const user = { email: 'test@normal.com' };
  // delete all messages from the mail server
  cy.request('DELETE', `${MAIL_SERVER_URL}/v1/messages`);
  cy.visit('/auth');
  cy.get('#email').type(user.email);
  //   get button with submit type
  cy.get('button[type="submit"]').click();

  // wait for the email to be received
  cy.wait(1000);

  // get the email from the mail server
  cy.request(`${MAIL_SERVER_URL}/v1/messages`).then((response) => {
    const { body } = response;
    console.log(body);
    const email = body[0];
    const emailBody = email.Content.Body;
    // extract the 6 digit password from the email
    const passcode = emailBody.match(/(\d{6})/)[0];

    const outerDiv = cy.get('#passcode');
    // get all inputs inside the div
    const inputs = outerDiv.find('input');
    // type the passcode in the inputs
    inputs.each((element, index) => {
      cy.wrap(element).type(passcode[index]);
    });
    cy.get('button[type="submit"]').click();
  });
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login as normal user
       */
      loginNormal: () => void;
    }
  }
}
