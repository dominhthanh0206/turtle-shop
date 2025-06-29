/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<Element>
    }
  }
}

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://dummyjson.com/auth/login',
    body: {
      username: 'emilys',
      password: 'emilyspass'
    }
  }).then((response) => {
    window.localStorage.setItem('user', JSON.stringify(response.body));
  });
});

export {}; 