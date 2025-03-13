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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Create/Signup User
app.post('/users', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('users');
  const user: Omit<User, '_id'> = req.body;

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

// Get All Events
app.post('/events', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  const loggedInUser: Omit<User, 'password'> | null = req.body;

  if (loggedInUser) {
    const userEventsWithUsers = await collection
      .aggregate([
        {
          $lookup: {
            from: 'users',
            let: { hostIds: '$hosts' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$hostIds'] } } },
              { $project: { firstName: 1, lastName: 1 } },
            ],
            as: 'hostsUserDetails',
          },
        },
      ])
      .toArray();

    res.status(200).json(userEventsWithUsers);
  }
});

app.get('/events/:id', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  const { id } = req.params;
  console.log(id);

  const eventWithUsers = await collection
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          let: { hostIds: '$hosts' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$hostIds'] } } },
            { $project: { password: 0 } },
          ],
          as: 'hostsUserDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { attendeeIds: '$attendees' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$attendeeIds'] } } },
            { $project: { password: 0 } },
          ],
          as: 'attendeesUserDetails',
        },
      },
    ])
    .toArray();

  res.status(200).json(eventWithUsers[0]);
});

// Create Event
app.post('/create-event', async (req, res) => {
  const db = await connectDB();
  const collection = db.collection('events');

  try {
    if (req.body && req.body.hosts) {
      const eventData = {
        ...req.body,
        hosts: req.body.hosts.map((id: string) => new ObjectId(id)),
        attendees: [],
      };

      const createdEvent = await collection.insertOne(eventData);

      res.json(createdEvent.insertedId);
    } else {
      throw new Error('Event hosts are missing');
    }
  } catch (error) {
    console.error(error);
  }
});
