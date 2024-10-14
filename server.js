import express from 'express';
import odbc from 'odbc';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connectionString = process.env.DB_CONNECTION_STRING;
const serviceLayerUrl = process.env.SERVICE_LAYER_URL;
const serviceLayerUsername = process.env.SERVICE_LAYER_USERNAME;
const serviceLayerPassword = process.env.SERVICE_LAYER_PASSWORD;

let serviceLayerSession = null;

async function loginToServiceLayer() {
  try {
    const response = await axios.post(`${serviceLayerUrl}/Login`, {
      CompanyDB: process.env.SAP_COMPANY_DB,
      UserName: serviceLayerUsername,
      Password: serviceLayerPassword
    });
    serviceLayerSession = response.data.SessionId;
    console.log('Logged in to Service Layer successfully');
  } catch (error) {
    console.error('Error logging in to Service Layer:', error.message);
    throw error;
  }
}

app.get('/api/items', async (req, res) => {
  let connection;
  try {
    console.log('Attempting to connect to database...');
    connection = await odbc.connect(connectionString);
    console.log('Connected to database successfully');

    console.log('Executing query...');
    const result = await connection.query('SELECT ItemCode, ItemName, ItemPrice FROM OITM');
    console.log('Query executed successfully');

    const items = result.map(item => ({
      id: item.ItemCode,
      name: item.ItemName,
      price: parseFloat(item.ItemPrice)
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Error in /api/items:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (!serviceLayerSession) {
      await loginToServiceLayer();
    }

    const { customerName, items, total } = req.body;

    const orderData = {
      CardCode: customerName, // Assuming CustomerName is used as CardCode
      DocDate: new Date().toISOString().split('T')[0],
      DocDueDate: new Date().toISOString().split('T')[0],
      DocumentLines: items.map(item => ({
        ItemCode: item.id,
        Quantity: item.quantity,
        UnitPrice: item.price
      }))
    };

    const response = await axios.post(`${serviceLayerUrl}/Orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `B1SESSION=${serviceLayerSession}`
      }
    });

    console.log('Order created in SAP HANA:', response.data);
    res.status(201).json({ message: 'Order created successfully', sapOrderId: response.data.DocEntry });
  } catch (error) {
    console.error('Error creating order in SAP HANA:', error.message);
    res.status(500).json({ error: 'Error creating order', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Database connection string:', connectionString);
});