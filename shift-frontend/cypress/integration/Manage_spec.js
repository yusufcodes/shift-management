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

  describe("Success: Create, edit & delete a shift", () => {
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
      cy.get("#datetime-end").type("2021-05-02T16:00");
      // Confirm change to shift by pressing OK inside Modal
      cy.get("span").contains("OK").click();
      // Look for success message related to editing shift
      cy.get(".MuiAlert-filledSuccess").contains(
        "Success - shift has been edited"
      );
    });

    it("delete new shift and see success message", () => {
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

  describe("Error scenarios: editing a shift", () => {
    const shiftTitle = "'2:00 PM – 10:00 PM: Mark Bloomfield'";
    it("set the start day to be later than the end day and display an error upon submission", () => {
      // Select shift from calendar
      cy.get(`div[title=${shiftTitle}]`).click();
      // Select 'start' input and alter the day to be later than the end day (example date: 25th June)
      cy.get("#datetime-start").type("2021-06-25T22:00");
      // Confirm change to shift by pressing OK inside Modal
      cy.get("span").contains("OK").click();
      // Expect error message in the input
      cy.get("p").contains(
        "Shift start time must be smaller than the end time"
      );
    });

    it("set the start and end day across different days and display an error upon submission", () => {
      // Select shift from calendar
      cy.get(`div[title=${shiftTitle}]`).click();
      // Select 'start' input and alter the day to be later than the end day (example date: 25th June)
      cy.get("#datetime-end").type("2021-06-25T22:00");
      // Confirm change to shift by pressing OK inside Modal
      cy.get("span").contains("OK").click();
      // Expect error message in the input
      cy.get("p").contains("Shift must start and end on the same day");
    });

    it("set the length of the shift to be longer than 10 hours and display an error upon submission", () => {
      // Select shift from calendar
      cy.get(`div[title=${shiftTitle}]`).click();
      // Select 'start' input and alter the day to be later than the end day (example: shift starting earlier and ending at same time)
      cy.get("#datetime-start").type("2021-05-05T11:00");
      // Confirm change to shift by pressing OK inside Modal
      cy.get("span").contains("OK").click();
      // Shift should not exceed 10 hours
      cy.get("p").contains("Shift should not exceed 10 hours");
    });
  });
});
