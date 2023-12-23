describe('Button Load', () => {
  const codeToLoad = '1+1';
  beforeEach(() => {
    cy.visit('/');
    cy.get('form .mantine-Textarea-input').as('editor');
    cy.get('span').contains('Load Code').parent().parent().as('load-btn');
  });

  it('Open modal', () => {
    cy.get('@load-btn').click();

    cy.get('.mantine-Modal-content').should('be.visible');
  });

  it('Load code', () => {
    cy.get('@load-btn').click();

    cy.get('[data-cy=saved-code]').eq(0).as('row');

    cy.get('@row').children().eq(0).invoke('text').as('code');
    cy.get('@row').children().eq(1).invoke('text').as('code-name');

    cy.get('[data-cy=saved-code]').eq(0).contains('Load').click();

    cy.get('@code').then(code => cy.get('@editor').should('have.value', code))
    cy.get('@code-name').then(name => cy.get('[data-cy=code-label]').eq(0).contains(name))
    cy.get('[data-cy=code-label]').contains('Saved')
  });

  it('Delete code in modal', () => {
    cy.get('@load-btn').click();

    cy.get('[data-cy=saved-code]').then(rows => {
      const length = rows.length;

      cy.get('[data-cy=saved-code]').eq(0).contains('Delete').click();

      cy.get('[data-cy=saved-code]').should('have.length', length - 1)
        cy.get('.mantine-Notifications-root').contains('Success');
    })
  });

  it('Delete code in editor', () => {
    cy.get('@load-btn').click();

    cy.get('[data-cy=saved-code]').then(rows => {
      const length = rows.length;

      cy.get('[data-cy=saved-code]').eq(0).contains('Load').click();

      cy.contains('Delete Code').click();

      cy.get('.mantine-Notifications-root').contains('Success');

      cy.get('@load-btn').click();

      cy.get('[data-cy=saved-code]').should('have.length', length - 1)
    })
  });

  it('Drops the value in input after exiting loading', () => {
    const typeValue = 'abc';

    cy.get('@editor').type(typeValue).wait(1000);

    cy.get('@load-btn').click();
    cy.get('[data-cy=saved-code]').eq(0).contains('Load').click();

    cy.contains('Exit Edit').click();

    cy.get('@editor').should('have.value', '')
  })


  it('Changes status to edited when edit code and saves code with new value', () => {
    const typeValue = 'abd';

    cy.get('@load-btn').click();

    cy.get('[data-cy=saved-code]').eq(0).as('row');
    cy.get('@row').children().eq(0).then(el => {
      const code = el.text();
      
      cy.get('[data-cy=saved-code]').eq(0).contains('Load').click();
      
      cy.get('@editor').type(typeValue);
      
      cy.get('[data-cy=code-label]').contains('Edited')
      
      cy.contains('Update Code').click();
      
      cy.contains('.mantine-Modal-content button', 'Update Code').click();
      
      cy.get('@load-btn').click();

      cy.get('[data-cy=saved-code]').eq(0).contains(code + typeValue)
    })
  })
});
