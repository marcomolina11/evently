import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import { User } from '@evently/shared';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');

  const users = await collection.find().toArray();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');
  const user: Omit<User, '_id'> = req.body;

  const result = await collection.insertOne(user);

  const createdUser = await collection.findOne(result.insertedId);

  const userObject = JSON.parse(JSON.stringify(createdUser));
  const { password, ...safeUser } = userObject;

  res.json(safeUser);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
