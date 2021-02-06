## Section 6: Node and Express Refresher

- Node.js: A JavaScript Runtime, allowing for JS to be ran outside of the browser. 
- Using Node.js without Express: A lot of extra code written for simple things such as extracting data from a POST request

**Express.js**

- Node framework to make building web servers easier

**Useful Packages**

- Nodemon: Hot reload when saving code
- Body Parser: Parse data from a request 

**Code Execution**

- Everything is executed straight away except for the middleware functions. These are **callbacks**, only executed when they are called. In this case, it is when a request matching our criteria (.get, .post) reaches the server.

## Section 7: Node and Express - Building a REST API