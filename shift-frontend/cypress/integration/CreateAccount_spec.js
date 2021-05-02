/* eslint-disable no-undef */
describe("== Create Account Page ==", () => {
  const email = "mark123@gmail.com";
  const password = "password1234";

  // Perform user login to get into app before performing tests
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type(password);
    cy.get("button").click();

    // Navigate to Manage page
    cy.get("#menu-button").click();
    cy.get("span").contains("Create Account").click();
  });

  it("create a new account that is not an admin", () => {
    cy.get("#name").focus().type("Test User NON-Admin");
    cy.get("#email").focus().type("testuser-nonadmin@gmail.com");
    cy.get("#password").focus().type("password123");
    cy.get("button").contains("Submit").click();
    cy.get(".MuiAlert-filledSuccess").contains("Success - account created");
  });

  it("create a new account that is an admin", () => {
    cy.get("#name").focus().type("Test User Admin");
    cy.get("#email").focus().type("testuser-admin@gmail.com");
    cy.get("#password").focus().type("password123");
    cy.get('[type="checkbox"]').check();
    cy.get("button").contains("Submit").click();
    cy.get(".MuiAlert-filledSuccess").contains("Success - account created");
  });
});
