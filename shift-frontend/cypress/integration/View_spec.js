/* eslint-disable no-undef */
describe("== View Page ==", () => {
  const email = "mark123@gmail.com";
  const password = "password1234";

  describe("Press Export Shifts to download PDF of shifts", () => {
    before(() => {
      cy.visit("http://localhost:3000/");
      cy.get("#email").focus().type(email);
      cy.get("#password").focus().type(password);
      cy.get("button").click();
      cy.get("a").contains("Export Shifts").click();
    });

    it('check that pdf successfully downloaded and one of the pages has "February" ', () => {
      cy.task("readPdf", "./cypress/downloads/Mark_Bloomfield_Shifts.pdf").then(
        ({ text }) => {
          expect(text, "has expected text").to.include("February");
        }
      );
    });
  });

  describe("Interact with calendar buttons 'Today', 'Back' and 'Next'", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/");
      cy.get("#email").focus().type(email);
      cy.get("#password").focus().type(password);
      cy.get("button").click();
    });
    it("should be able to press 'Today', 'Back' and 'Next' buttons", () => {
      cy.get(".rbc-toolbar").within(() => {
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
    });

    it("should be able to press 'Month', 'Week', 'Day' and 'Agenda' buttons", () => {
      cy.get(".rbc-toolbar").within(() => {
        cy.get(".rbc-btn-group")
          .eq(1)
          .within(() => {
            cy.get("button").contains("Week").click();
          });
        cy.get(".rbc-btn-group")
          .eq(1)
          .within(() => {
            cy.get("button").contains("Day").click();
          });
        cy.get(".rbc-btn-group")
          .eq(1)
          .within(() => {
            cy.get("button").contains("Agenda").click();
          });
        cy.get(".rbc-btn-group")
          .eq(1)
          .within(() => {
            cy.get("button").contains("Month").click();
          });
      });
    });
  });
});
