# Authentication & Authorization - Notes

## How Authentication works in MERN

- Normally the user flow would be:...
- Create a session on the server, stored in the database, and send Session ID to frontend
- However with a SPA and a Server-Side API, they are not connected as they normally would with a server side rendered application.

- However: SPA Backends (APIs) are stateless and decoupled from the frontend

Session not stored on the server, generate a token from the server instead.
Return token for the frontend and store this in a cookie or localStorage.
Attach this cookie when making requests to the backend.
Server validates the token that is sent - private key is used to validate the token that is sent from the front end.

##

##

