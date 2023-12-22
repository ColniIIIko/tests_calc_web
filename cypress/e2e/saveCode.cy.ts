describe('Button Save', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('form .mantine-Textarea-input').as('editor');
    cy.get('span').contains('Save Code').parent().parent().as('save-btn');
    cy.intercept("POST", '/submit').as('sendCode');
    cy.intercept("GET", '/code').as('getCode');
  });

  it('Valid input and valid name', () => {
    const typeValue = '1+10';
    const name = 'Darya';

    cy.get('@editor').type(typeValue).wait(1000);
    cy.get('@save-btn').click();

    cy.get('input').as('nameInput');
    cy.get('@nameInput').type(name).wait(1000);
    cy.get('span').contains('Save code').click();

    cy.get('.mantine-Notifications-root').contains('Success');
    cy.get('.mantine-Notifications-root').contains('Code was succesfully saved !');

    cy.contains('Load Code').click();

    cy.get('[data-cy=saved-code]').eq(-1).contains(typeValue);
    cy.get('[data-cy=saved-code]').eq(-1).contains(name);
  });

  it('Valid input and empty name', () => {
    const typeValue = '2+4';

    cy.get('@editor').type(typeValue).wait(1000);
    cy.get('@save-btn').click();

    cy.get('input').as('nameInput');
    cy.get('@nameInput').should('have.value', '').wait(1000);

    cy.get('span').contains('Save code').parent().parent().should('be.disabled');
  });

  it('Invalid input', () => {
    const typeValue = '2+4)+';
    const name = 'Darya';

    cy.get('@editor').type(typeValue).wait(1000);
    cy.get('@save-btn').click();

    cy.get('input').as('nameInput');
    cy.get('@nameInput').type(name).wait(1000);
    cy.get('span').contains('Save code').click();

    cy.get('.mantine-Notifications-root').contains('Success');
    cy.get('.mantine-Notifications-root').contains('Code was succesfully saved !');

    cy.contains('Load Code').click();

    cy.get('[data-cy=saved-code]').eq(-1).contains(typeValue);
    cy.get('[data-cy=saved-code]').eq(-1).contains(name);
  });
});
