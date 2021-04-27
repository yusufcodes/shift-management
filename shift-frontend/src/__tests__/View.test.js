import React from "react";
import View from "../pages/View";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/dont-cleanup-after-each";
import userEvent from "@testing-library/user-event";

describe("View", () => {
  test("user can see a calendar of shifts", () => {
    const testEvents = [
      {
        title: "Shift",
        start: new Date(),
        end: new Date(),
      },
      {
        title: "Shift",
        start: new Date(),
        end: new Date(),
      },
    ];
    // Render page - default is Login screen
    render(<View testEvents={testEvents} />);

    const calendarMonth = screen.getByLabelText("Month View");
    expect(calendarMonth).toBeVisible();

    //  screen.debug();
  });
});
