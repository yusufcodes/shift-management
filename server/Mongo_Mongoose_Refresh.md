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

### Adding MongoDB & performing requests ton the database

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

### Using Mongoose

Mongoose: Third party library which makes the interaction with the MongoDB database more easier. This is also helpful for creating structured data.

#### Models and Schemas - definition

Models can be used to map your app's data to the backend, so you only accept data of a specific structure. 

**Creating Schemas in Mongoose**
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  // `lastActiveAt` is a date
  lastActiveAt: Date
});
const User = mongoose.model('User', userSchema);
```

#### Models and Schemas - using them

This bit of code shows how you can add a new Document to the database following a schema that has been created. Also includes how to connect to the database in Mongoose (instead of the regular MongoDB driver).

```js
const mongoose = require('mongoose');

// Import the model
const Product = require('./models/product');

// Mongoose handles connecting and disconnecting to the database for us - returns a Promise
mongoose.connect('url-here'
).then(() => console.log('Connected to db')
).catch(() => console.log('Connection failed'));

const createProduct = async (req, res, next) => {
   const createdProduct = new Product({
      name: req.body.name,
      price: req.body.price,
   });
   const result = await createdProduct.save(); 

   res.json(result);
};

```

### ObjectID

ID is automatically added to documents when added to the database. (Either MongoDB and Mongoose). It is of type **OjectId**. 

Mongoose makes it easy to ge the string version by referring to the ID as **.id** instead of **._id**
