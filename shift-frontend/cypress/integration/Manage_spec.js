/* eslint-disable no-undef */
describe("== Manage Page ==", () => {
  const email = "mark123@gmail.com";
  const password = "password1234";

  // Perform user login to get into app before performing tests
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get("#email").focus().type(email);
    cy.get("#password").focus().type(password);
    cy.get("button").click();
  });

  describe("Create, edit & delete a shift", () => {
    beforeEach(() => {
      // Navigate to Manage page
      cy.get("#menu-button").click();
      cy.get("span").contains("Manage").click();

      // Change to 'Week' view
      cy.get(".rbc-toolbar").within(() => {
        cy.get(".rbc-btn-group")
          .eq(1)
          .within(() => {
            cy.get("button").contains("Week").click();
          });
      });
    });
    it("create a new shift and see success message", () => {
      // Perform drag and drop on calendar view to select shift time frame
      cy.get(".rbc-day-slot")
        .eq(0)
        .trigger("mousemove", { clientX: 990, clientY: 400 })
        .trigger("mousedown", { which: 1 })
        .trigger("mousemove", { clientX: 990, clientY: 500 })
        .trigger("mouseup", { force: true });

      // Select employee to create shift for
      cy.get("#employee-select").select("Mark Bloomfield");

      // Confirm shift creation & check that success dialog is rendered
      cy.get("span").contains("OK").click();
      cy.get(".MuiAlert-filledSuccess").contains(
        "Success - shift has been added"
      );
    });

    it("edit new shift and see success message", () => {
      // Select shift from calendar
      cy.get("div[title='12:00 PM – 1:00 PM: Mark Bloomfield']").click();
      // Select 'end' input and alter the time from 12PM to 4PM
      cy.get("#datetime-end").type("2021-04-25T16:00");
      // Confirm change to shift by pressing OK inside Modal
      cy.get("span").contains("OK").click();
      // Look for success message related to editing shift
      cy.get(".MuiAlert-filledSuccess").contains(
        "Success - shift has been edited"
      );
    });

    it.only("delete new shift and see success message", () => {
      // Select shift from calendar
      cy.get("div[title='12:00 PM – 4:00 PM: Mark Bloomfield']").click();
      // Click on delete button
      cy.get("button[aria-label='delete']").click();
      // Confirm that user wants to delete the shift in modal, by pressing OK
      cy.get("div[aria-labelledby='delete-shift-dialog-title']").within(() => {
        cy.get("span").contains("OK").click();
      });
      // Look for success message related to deleting shift
      cy.get(".MuiAlert-filledSuccess").contains(
        "Success - shift has been deleted"
      );
    });
  });
});
