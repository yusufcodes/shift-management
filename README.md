
# Shift Mangement Application

## Project Purpose
This project was developed as part of my BSc Computer Science degree (2021) as part of my dissertation: "Shift Management Web Application to
Aid Management Teams".

The purpose of this project was to replace an Excel-based system at my old workplace for handling the working schedule of the management team. After identifying various issues with the current Excel based system, I worked to eliminate these through building this web application.

Please note that this is **not** an open project, so there is no sign up process. Please contact me for account details if you intend to make use of this app for experimentation.



## About

This web application is for anyone who wants to manage the working schedules of their teams. 

You can log in as either an employee or a manager.

Employees can:
- View their own working shifts
- Export their shifts to PDF

Managers can do the same, but with the following extras:
- Adding, editing or deleting shifts for any employee


## Installation

This project has two installation sections, for the frontend (React) and Backend (Node)

### Front End

Navigate to the **shift-frontend** folder and execute the following commands:

```bash
  yarn install
  yarn start
```

The application should automatically open up at http://localhost:3000/.


### Back End

Navigate to the **server** folder and execute the following commands:

```bash
  yarn install
  yarn start
```

The server should start up at http://localhost:5000/ - a message to confirm this will be displayed in the terminal.

    
## Running Tests

### Front End

Run the following command in the **shift-frontend** folder:

```bash
  yarn run cypress open
```

### Back End
If an instance of the server is already running in another terminal, kill this process first before executing the tests. Run the following command in the **server** folder:

```bash
  yarn test
```



## Tech Stack
JavaScript using the following:

**Client:** React

**Server:** MongoDB, Express, Node

  