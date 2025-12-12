require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const predictRoute = require('./routes/predict');


const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'meddb';


let db;
MongoClient.connect(uri, { useUnifiedTopology: true })
.then(client => {
db = client.db(dbName);
app.locals.db = db;
console.log('Connected to MongoDB');
app.listen(port, () => console.log('Backend running on', port));
})
.catch(err => {
console.error('Mongo connection error', err);
process.exit(1);
});


app.use('/predict', predictRoute);


// Basic health
app.get('/health', (req,res)=> res.json({ok:true}));