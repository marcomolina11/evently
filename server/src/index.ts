import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { User } from '@evently/shared';
import { UserDocument } from './schemas/UserDocument';
import { ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Get All Users
app.get('/', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');

  const users = await collection.find().toArray();
  res.json(users);
});

// Create/Signup User
app.post('/users', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');
  const user: Omit<User, '_id'> = req.body;

  // check if there's a user with that email already in DB
  // if true, send back a message saying that email already exists
  // else, create the user

  const emailExists = await collection.findOne({ email: user.email });

  let responseObject: { message: string; data: object } = {
    message: '',
    data: {},
  };

  if (emailExists) {
    responseObject = { ...responseObject, message: 'Email already exists' };
    res.json(responseObject);
  } else {
    const result = await collection.insertOne(user);

    const options = {
      projection: { password: 0 },
    };
    const createdUser: UserDocument | null =
      await collection.findOne<UserDocument>(result.insertedId, options);

    if (createdUser) {
      responseObject = {
        ...responseObject,
        data: createdUser,
      };
    }
    res.status(200).json(responseObject);
  }
});

// Login User
app.post('/login', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');
  const { email, password }: { email: string; password: string } = req.body;

  const user: UserDocument | null = await collection.findOne<UserDocument>({
    email: email,
  });

  let responseObject: { message: string; data: object } = {
    message: '',
    data: {},
  };

  // check is a user was found
  if (user && user.password === password) {
    responseObject = {
      ...responseObject,
      data: user,
    };
  } else {
    responseObject = {
      ...responseObject,
      message: 'Incorrect email or password',
    };
  }
  res.status(200).json(responseObject);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Get All Events
app.post('/events', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  const loggedInUser = req.body;

  if (loggedInUser) {
    const cursor = collection.find({ state: loggedInUser.state });
    const userEvents = await cursor.toArray();

    res.json(userEvents);
  }
});

// Create Event
app.post('/create-event', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  if (req.body && req.body.hosts) {
    const eventData = {
      ...req.body,
      hosts: req.body.hosts.map((id: string) => new ObjectId(id)),
    };

    const createdEvent = await collection.insertOne(eventData);

    res.json(createdEvent.insertedId);
  } else {
    throw new Error('Event hosts are missing');
  }
});
