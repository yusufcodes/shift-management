=== Introduction ===

This README will explain how to run the Shift Management Application, split into two parts:

1. Running the back end
2. Running the front end

=== Pre-Requisites ===

1. Node - the LTS version is fine for whichever operating system.
Download: https://nodejs.org/en/download/ 
Once Node has been installed, the next software 'Yarn' can be installed in the next step.

2. Yarn
Follow the documentation here to get Yarn installed: https://classic.yarnpkg.com/en/docs/install/

=== Running the application ===

1. Running the back-end

- Open up a terminal and navigate into the 'server' folder
- Run the command: yarn install
- Run the command: yarn start

The server should start up at http://localhost:5000/ - a message to confirm this will be displayed in the terminal.

To run the tests for the server, kill the process running the server first, and then run: yarn test

2. Running the front-end

- Open up a terminal and navigate to the 'shift-frontend' folder
- Run the command: yarn install
- Run the command: yarn start

The application should automatically open up at http://localhost:3000/.

To log in, the following credentials can be used:

Email: mark123@gmail.com
Password: password123

To run the tests for the frontend, run: yarn run cypress open

=== Accessing the database ===
Visit this link: https://account.mongodb.com/account/login

Email: yusufcodes@outlook.com
Password: 6P2kgiLntDpvdy

Under 'Cluster0', click on 'Collections' to view the data stored for the application.