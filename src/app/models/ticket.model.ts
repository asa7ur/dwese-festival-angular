import { Attendee } from './attendee.model';

export enum TicketType {
  VIP = 'VIP',
  GENERAL = 'GENERAL'
}

export interface Ticket {
  id?: number;
  price: number;
  type: TicketType;
  used: boolean;
  attendee?: Attendee;
  attendeeId?: number;
}
