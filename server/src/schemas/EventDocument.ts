import { ObjectId } from 'mongodb';

export interface EventDocument {
  _id: ObjectId;
  name: string;
  date: string;
  hosts: ObjectId[];
  attendees: ObjectId[];
  location: {
    city: string;
    state: string;
    formattedAddress: string;
  };
}
