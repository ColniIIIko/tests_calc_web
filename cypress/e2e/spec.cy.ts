describe('Behavior of app is correct', () => {
  
  beforeEach(() => {
    cy.visit('/');
    cy.get('form textarea').as('editor');
    cy.get('span').contains('Send').parent().parent().as('send-btn');
    cy.get('span').contains('Save Code').parent().parent().as('save-btn');
    cy.get('span').contains('Load Code').parent().parent().as('load-btn');
    cy.intercept("POST", '/submit').as('sendCode')
  })

  it('Textarea is empty and buttons disabled', () => {
    cy.get('@editor').should('have.value', '');
    cy.get('@send-btn').should('be.disabled');
    cy.get('@save-btn').should('be.disabled');
    cy.get('@load-btn').should('not.be.disabled');
  })

  it('Textarea input is correct and become enabled', () => {
    const typeValue = '1+1';
    cy.get('@editor').type(typeValue);

    cy.get('@editor').should('have.value', typeValue);
    cy.get('@send-btn').should('not.be.disabled');
    cy.get('@save-btn').should('not.be.disabled');
    cy.get('@load-btn').should('not.be.disabled');
  })

  it('Correct error notification is shown on not finished operation', () => {
    const typeValue = '1+';
    cy.get('@editor').type(typeValue).wait(1000);

    cy.get('@send-btn').click();

    cy.get('.mantine-Notifications-root').contains('Error');
    cy.get('.mantine-Notifications-root').contains('After operation there should be expression');
  })

  it('Correct notification is shown on unexpected character', () => {
    const typeValue = '1+-';
    cy.get('@editor').type(typeValue).wait(1000);

    cy.get('@send-btn').click();

    cy.get('.mantine-Notifications-root').contains('Error');
    cy.get('.mantine-Notifications-root').contains('Error at expression\'s cycle. Unexpected -');
  })

  it('Correct notification is shown on unexpected character', () => {
    const typeValue = '(1+2*2';
    cy.get('@editor').type(typeValue).wait(1000);

    cy.get('@send-btn').click();

    cy.get('.mantine-Notifications-root').contains('Error');
    cy.get('.mantine-Notifications-root').contains('Opened parenthesis doesn\'t have closed corresponding one');
  })

  it('Correct notification is shown on success', () => {
    const typeValue = '1+2';
    cy.get('@editor').type(typeValue).wait(1000);

    cy.get('@send-btn').click();

    cy.get('.mantine-Notifications-root').contains('Success');
    cy.get('.mantine-Notifications-root').contains('Code was successfully compiled !');

    cy.get('.mantine-Alert-root .mantine-Text-root').contains('3');
  })
})