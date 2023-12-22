const errorOneLineTestCases = [
  {
    input: "2 +",
    expectedResult: "After operation there should be expression"
  },
  {
    input: "10 / 0",
    expectedResult: "Division by zero is bad"
  },
  {
    input: "5 * (2 +",
    expectedResult: "Opened parenthesis doesn\'t have closed corresponding one"
  },
  {
    input: "(3 + 5) * 2)",
    expectedResult: "Closed parenthesis doesn\'t have opened corresponding one"
  },
  {
    input: "4 + * 6",
    expectedResult: "Error at expression"
  },
  {
    input: "20 / (4 - 4)",
    expectedResult: "Division by zero is bad"
  },
  {
    input: "10 / (2 *",
    expectedResult: "Opened parenthesis doesn\'t have closed corresponding one"
  },
  {
    input: "((2 + 3 * 4) - 1 / 5",
    expectedResult: "Opened parenthesis doesn\'t have closed corresponding one"
  },
  {
    input: "2,3",
    expectedResult: "Invalid character"
  },
  {
    input: "6 / (3 / 2))",
    expectedResult: "Closed parenthesis doesn\'t have opened corresponding one"
  }
];

describe('Test all correct inputs', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('form textarea').as('editor');
    cy.get('span').contains('Send').parent().parent().as('send-btn');
    cy.intercept("POST", '/submit').as('sendCode')
  })

  for(let {input, expectedResult} of errorOneLineTestCases){
    it(`Correct answer for ${input}`, () => {
      cy.get('@editor').type(input).wait(1000);
      
      cy.get('@send-btn').click();
      
      cy.get('.mantine-Notifications-root').contains('Error');
      cy.get('.mantine-Notifications-root').contains(expectedResult);
      
      cy.get('.mantine-Alert-root .mantine-Text-root').should('not.exist');
    })
  }
  })