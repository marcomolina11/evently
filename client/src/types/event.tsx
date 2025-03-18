import { User } from '@evently/shared';

export type Event = {
  _id: string;
  name: string;
  date: string;
  hosts: string[];
  hostsUserDetails: Omit<User, 'password'>[];
  attendees: string[];
  attendeesUserDetails: Omit<User, 'password'>[];
  location?: {
    city: string;
    state: string;
    formattedAddress: string;
  };
};
