import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  password: string;
}
