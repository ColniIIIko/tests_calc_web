const successOneLineTestCases = [
  {
    input: "2 + 3",
    expectedResult: 5
  },
  {
    input: "10 - 5",
    expectedResult: 5
  },
  {
    input: "4 * 6",
    expectedResult: 24
  },
  {
    input: "20 / 4",
    expectedResult: 5
  },
  {
    input: "(3 + 5) * 2",
    expectedResult: 16
  },
  {
    input: "8 / (2 + 2)",
    expectedResult: 2
  },
  {
    input: "(10 - 3) * (4 + 2)",
    expectedResult: 42
  },
  {
    input: "(((2 + 3) * 4) - 1) / 5",
    expectedResult: 3.8
  },
  {
    input: "9 * (2 + 1) / 3",
    expectedResult: 9
  },
  {
    input: "6 / (3 / 2)",
    expectedResult: 4
  }
];

describe('Test all correct inputs', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('form textarea').as('editor');
    cy.get('span').contains('Send').parent().parent().as('send-btn');
    cy.intercept("POST", '/submit').as('sendCode')
  })

  for(let {input, expectedResult} of successOneLineTestCases){
    it(`Correct answer for ${input}`, () => {
      cy.get('@editor').type(input).wait(1000);
      
      cy.get('@send-btn').click();
      
      cy.get('.mantine-Notifications-root').contains('Success');
      cy.get('.mantine-Notifications-root').contains('Code was successfully compiled !');
      
      cy.get('.mantine-Alert-root .mantine-Text-root').contains(expectedResult.toString());
    })
  }
  })
