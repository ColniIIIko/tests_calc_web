const successTestCasesWithVariables = [
  {
    input: "let a = 5;\nlet b = 6;\na + b",
    expectedResult: [11]
  },
  {
    input: "let x = 4, y = 3;\nx + y\ny + 5",
    expectedResult: [7, 8]
  },
  {
    input: "const num1 = 8;\nlet num2 = 2;\nnum1 * num2",
    expectedResult: [16]
  },
  {
    input: "let m = 3;\n m * 2\nlet n = 2;\nm * n",
    expectedResult: [6,6]
  },
];

describe('Test all correct inputs', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('form textarea').as('editor');
    cy.get('span').contains('Send').parent().parent().as('send-btn');
    cy.intercept("POST", '/submit').as('sendCode')
  })

  for(let {input, expectedResult} of successTestCasesWithVariables){
    it(`Correct answer for ${input}`, () => {
      cy.get('@editor').type(input).wait(1000);
      
      cy.get('@send-btn').click();
      
      cy.get('.mantine-Notifications-root').contains('Success');
      cy.get('.mantine-Notifications-root').contains('Code was successfully compiled !');
      
      expectedResult.map(
        res =>
        cy.get('.mantine-Alert-root .mantine-Text-root').contains(res)
      )
    })
  }
})