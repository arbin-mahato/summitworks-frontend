export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Hotel {
  hotelId: number;
  hotelName: string;
  city: string;
  state: string;
  description: string;
  startingPrice: number;
  totalRooms: number;
  availableRooms: number;
  calendar: Availability[];
  image?: string; 
  rating?: number; 
  rooms?: Room[];
}

export interface Availability {
  date: string;
  available: boolean;
  availableRooms: number;
}

export interface Room {
  roomId: number;
  roomLabel: string;
  roomType: string;
  price: number;
  features: string[];
  available: boolean;
  image?: string; 
}

export interface Booking {
  bookingId: number;
  hotelName: string;
  city: string;
  state: string;
  roomLabel: string;
  roomType: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  // Legacy fields for backward compatibility if needed by some components
  id?: string;
  userName: string;
}
