const errorTestCasesWithVariables = [
  {
    input: "letatdfa a = 5\n a + 5",
    expectedResult: "Invalid character"
  },
  {
    input: "constatdfa a = 5\n a + 5",
    expectedResult: "Invalid character"
  },
  {
    input: "const const = 5",
    expectedResult: "expression is not defined"
  },
  {
    input: "let let = 4",
    expectedResult: "expression is not defined"
  },
  {
    input: "y = 4",
    expectedResult: "expression is not defined"
  },
  {
    input: "4 + a",
    expectedResult: "Invalid character"
  },
  {
    input: "4 + a\n let a = 5",
    expectedResult: "Invalid character"
  },
];

describe('Test all correct inputs', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('form textarea').as('editor');
    cy.get('span').contains('Send').parent().parent().as('send-btn');
    cy.intercept("POST", '/submit').as('sendCode')
  })

  for(let {input, expectedResult} of errorTestCasesWithVariables){
    it(`Correct answer for ${input}`, () => {
      cy.get('@editor').type(input).wait(1000);
      
      cy.get('@send-btn').click();
      
      cy.get('.mantine-Notifications-root').contains('Error');
      cy.get('.mantine-Notifications-root').contains(expectedResult);
      
      cy.get('.mantine-Alert-root .mantine-Text-root').should('not.exist');
    })
  }
  })