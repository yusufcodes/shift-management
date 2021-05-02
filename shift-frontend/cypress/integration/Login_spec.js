/* eslint-disable no-undef */
describe("== Login Page ==", () => {
  const email = "mark123@gmail.com";
  const password = "password1234";

  // Successful login
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  it("enters correct login details and proceeds to dashboard", () => {
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type(password);
    cy.get("button").click();
    cy.get("h1").should("have.text", "My Schedule");
  });

  // Unsuccessful login: incorrect username and password
  it("enters incorrect login details and display login error message", () => {
    cy.get("#email").focus().type("mark1234@gmail.com"); // incorrect email
    cy.get("#password").focus().type(password);
    cy.get("button").click();
    cy.get("p").should(
      "have.text",
      "Login credentials incorrect - please try again"
    );
  });

  // Empty input value: example with password missing
  it("enter an email without a password and login button should be disabled", () => {
    cy.get("#email").focus().type(email);
    cy.get("button").should("be.disabled");
  });

  // Invalid email address
  it("enter an invalid email address and invalid email error message", () => {
    cy.get("#email").focus().type("mark1234"); // invalid email
    cy.get("#password").focus().type(password);
    cy.get("button").click();
    cy.get("#email-helper-text").should(
      "have.text",
      "Please enter a valid email address"
    );
  });

  // Invalid password (less than 6 characters)
  it("enter an invalid password and output error message", () => {
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type("pass"); // invalid password
    cy.get("button").click();
    cy.get("#password-helper-text").should(
      "have.text",
      "Please enter a password with at least six characters"
    );
  });

  it("after logging in, perform logout and be redirected back to the login screen", () => {
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type(password);
    cy.get("button").click();
    // Open menu and press logout
    cy.get("#menu-button").click();
    cy.get("span").contains("Logout").click();
    cy.get("h1").contains("Shift Management App");
  });
});
