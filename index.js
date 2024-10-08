//Setup express & dependencies
//npm init -y
//npm install express mongodb dotenv cors
//npm install bcrypt
//npm install jsonwebtoken
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require('bcrypt');
const MongoClient = require("mongodb").MongoClient;
const dbname = "sales_order_app";
const mongoUri = process.env.MONGO_URI;
const app = express();
const jwt = require('jsonwebtoken');
const generateAccessToken = (id, email) => {
    return jwt.sign({
        'user_id': id,
        'email': email
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
}

//Check for the presence of JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

//Enable processing JSON data
app.use(express.json());
app.use(cors());
async function connect(uri, dbname) {
    let client = await MongoClient.connect(uri, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    return _db;
}

//Create routes
async function main() {
    let db = await connect(mongoUri, dbname);
    const { ObjectId } = require('mongodb');

    //Test server: http://localhost:3000/
    app.get('/', function (req, res) {
        res.json({
            "message": "Server is listening"
        });
    })

    //POST users: {"email":"samtan@abc.com", "password":"abc123"}
    app.post('/users', async function (req, res) {
        const result = await db.collection("users").insertOne({
            'email': req.body.email,
            'password': await bcrypt.hash(req.body.password, 12)
        })
        res.json({
            "message": "New user account",
            "result": result
        })
    })

    //POST login to get token: {"email":"samtan@abc.com", "password":"abc123"}
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await db.collection('users').findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const accessToken = generateAccessToken(user._id, user.email);
        res.json({ accessToken: accessToken });
    });

    //GET profile by pasting the token at Auth-Bearer: http://localhost:3000/profile/
    app.get('/profile', verifyToken, (req, res) => {
        res.json({ message: 'This is a protected route', user: req.user });
      });
    
    //GET item: http://localhost:3000/item/
    app.get("/item", async (req, res) => {
        try {
            const item = await db.collection("item").find().project({
                item_number: 1,
                description: 1,
                country_of_origin: 1,
                price: 1
            }).toArray();

            res.json({ item });
        } catch (error) {
            console.error("Error getting item:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    //POST item: http://localhost:3000/item/
    app.post('/item', async (req, res) => {
        try {
            const { item_number, description, country_of_origin, price } = req.body;
            if (!item_number || !description || !country_of_origin || !price) {
                return res.status(400).json({ error: 'Item data incomplete' });
            }

            const newItem = {
                item_number,
                description,
                country_of_origin,
                price
            };

            const result = await db.collection('item').insertOne(newItem);
            res.status(201).json({
                message: 'Item created',
                itemId: result.insertedId
            });
        } catch (error) {
            console.error('Error creating item:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    //GET sales_order: http://localhost:3000/sales_order/<_id>
    app.get("/sales_order/:id", async (req, res) => {
        try {
            const id = req.params.id;
            const orderId = await db.collection("sales_order").findOne(
                { _id: new ObjectId(id) },
                { projection: { _id: 0 } }
            );
            if (!orderId) {
                return res.status(404).json({ error: "Sales order not found" });
            }
            res.json(orderId);
        } catch (error) {
            console.error("Error fetching sales order:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
        
    //POST sales order: http://localhost:3000/sales_order/
    app.post('/sales_order', async (req, res) => {
        try {
            const { item_number, order_quantity, delivery_date } = req.body;
            const itemDoc = await db.collection('item').findOne({ item_number: item_number });
            if (!itemDoc) {
                return res.status(400).json({ error: 'Invalid item number' });
            }

            const newSalesOrder = {
                item_number,
                order_quantity,
                delivery_date
            };

            const result = await db.collection('sales_order').insertOne(newSalesOrder);
            res.status(201).json({
                message: 'Sales order created',
                salesOrderId: result.insertedId
            });
        } catch (error) {
            console.error('Error creating sales order:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    //PUT sales_order: http://localhost:3000/sales_order/<_id>
    app.put('/sales_order/:id', async (req, res) => {
        try {
            const orderId = req.params.id;
            const { item_number, order_quantity, delivery_date } = req.body;
            if (!item_number || !order_quantity || !delivery_date) {
                return res.status(400).json({ error: 'Sales order data incomplete' });
            }

            const updatedOrder = { item_number, order_quantity, delivery_date };
            const result = await db.collection('sales_order').updateOne(
                { _id: new ObjectId(orderId) },
                { $set: updatedOrder }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Sales order not found' });
            }
            res.json({
                message: 'Sales order updated'
            });
        } catch (error) {
            console.error('Error updating sales order:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    //DELETE sales order: http://localhost:3000/sales_order/<_id>
    app.delete('/sales_order/:id', async (req, res) => {
        try {
            const orderId = req.params.id;
            const result = await db.collection('sales_order').deleteOne({ _id: new ObjectId(orderId) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Sales order not found' });
            }
            res.json({ message: 'Sales order deleted' });
        } catch (error) {
            console.error('Error deleting sales order:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
}

main();

//Start server: nodemon index.js
//Browse: http://localhost:3000/
app.listen(3000, function () {
    console.log("Server started...");
})