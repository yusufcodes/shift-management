// sample_spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:

// https://on.cypress.io/writing-first-test
describe("My First Test", () => {
  it("Visit my local app", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#email").focus().type("mark123@gmail.com");
    cy.get("#password").focus().type("password1234");
    cy.get("button").click();
    cy.get(".rbc-toolbar").within(() => {
      // Testing 'Today, Back, Next' buttons'
      cy.get(".rbc-btn-group")
        .eq(0)
        .within(() => {
          cy.get("button").contains("Back").click();
        });
      cy.get(".rbc-btn-group")
        .eq(0)
        .within(() => {
          cy.get("button").contains("Next").click();
        });
      cy.get(".rbc-btn-group")
        .eq(0)
        .within(() => {
          cy.get("button").contains("Next").click();
        });
      cy.get(".rbc-btn-group")
        .eq(0)
        .within(() => {
          cy.get("button").contains("Today").click();
        });
    });

    //  cy.get("input").find("#email").focus().type("mark123@gmail.com");
  });
});
