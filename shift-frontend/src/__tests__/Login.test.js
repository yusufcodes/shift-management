import React from "react";
import Login from "../pages/Login";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/react/dont-cleanup-after-each";
import userEvent from "@testing-library/user-event";

describe("Login User Flow", () => {
  test("user can enter an email and password and press login button", () => {
    // Render page - default is Login screen
    render(<Login />);

    // Enter email
    const emailInput = screen.getByLabelText("Email");
    userEvent.type(emailInput, "mark@gmail.com");
    expect(emailInput.value).toBe("mark@gmail.com");

    // Enter password
    const passwordInput = screen.getByLabelText("Password");
    userEvent.type(passwordInput, "password123");
    expect(passwordInput.value).toBe("password123");

    // Press login
    const loginButton = screen.getByText("Login");
    userEvent.click(loginButton);
    expect(loginButton).toHaveTextContent("Logging in...");

    // screen.debug();
  });
});
