/* eslint-disable no-undef */
describe("== Account Page ==", () => {
  const email = "mark123@gmail.com";
  const password = "password1234";

  // Perform user login to get into app before performing tests
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type(password);
    cy.get("button").click();
    // Navigate to Account page
    cy.get("#menu-button").click();
    cy.get("span").contains("Account").click();
  });

  it("edit email, see success message, then change email back to what it was before", () => {
    cy.get("#email").clear().type("mark12@gmail.com");
    cy.get("button").contains("Submit").click();
    cy.get(".MuiAlert-filledSuccess").contains(
      "Success - Account details updated"
    );

    cy.get("#email").clear().type("mark123@gmail.com");
    cy.get("button").contains("Submit").click();

    cy.get(".MuiAlert-filledSuccess").contains(
      "Success - Account details updated"
    );
  });

  it("edit password, see success message, then change password back to what it was before", () => {
    cy.get("button").contains("Change Password").click();
    cy.get("div[aria-labelledby='password-change-modal']").within(() => {
      cy.get("#current-password").type("password1234");
      cy.get("#new-password").type("password123");
      cy.get("#new-password-confirm").type("password123");
      cy.get("button").contains("Submit").click();
    });
    cy.get(".MuiAlert-filledSuccess").contains(
      "Success - Account details updated"
    );

    cy.get("button").contains("Change Password").click();
    cy.get("div[aria-labelledby='password-change-modal']").within(() => {
      cy.get("#current-password").clear().type("password123");
      cy.get("#new-password").clear().type("password1234");
      cy.get("#new-password-confirm").clear().type("password1234");
      cy.get("button").contains("Submit").click();
    });
    cy.get(".MuiAlert-filledSuccess").contains(
      "Success - Account details updated"
    );
  });
});
