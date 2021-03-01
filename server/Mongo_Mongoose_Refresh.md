### MongoDB Introduction

- MongoDB: Database to be used
- Mongoose: Manage connection between backend and database
- MongoDB: NoSQL database, which stores data as a **Document** (like a Record in SQL), inside of a **Collection** (like a Table)
- No data schema or relations are enforced (unlike in SQL)

### Difference between SQL and NoSQL

#### NoSQL

- Example: MongoDB
- No strict data schema
- Less focus on relations (but still possible and used)
- Independent documents ➡️ each piece of data in the collection do not need to be related
- Good for: Logs, Orders, Messages - fast moving data

#### SQL

Example: MySQL
- Must stick to a data schema (defining structures of table and records)
- Relations are important
- Records are related
- Good for: Shopping Carts, Contacts, Networks - more structured data

### Using MongoDB Atlas

- Account created on Mongo and Cluster created in MongoDB Atlas

### Adding MongoDB

Note: Access password from .env file

Change 'myFirstDatabase' to default DB that should be connected to.

**Controller Example Code: **
```js
// Initialising the database
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://yusuf:<password>@cluster0.yjz1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

// Controller Example Code

const createProduct = async (req, res, next) => {
   // Controller logic before talking to the database
   const { body } = req;

   const newProduct = {
      name: body.name,
      price: body.price
   };

   // Tells Mongo which server to connect to (not the database just yet)
   const client = new MongoClient(url); 

   // Catch any errors when connecting to the server
   try {
      await client.connect(); // Establish connection to database
      const db = client.db(); // Access to the default database

      // Collection: has many methods on it to interact with
      const result = db.collection('products').insertOne(newProduct); // Access existing collection OR make a new collection if it doesn't exist
   } catch (error) { 
      return res.json({message: 'Could not store data'})
   }
   client.close(); // Close connection to the server
   res.json(newProduct); // Send response back upon completion of the request
}
```

### Code Examples - working with a MongoDB Cluster

These are typical examples that could be used in the Controller

```js

```
