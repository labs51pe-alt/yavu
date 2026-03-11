export type Role = 'passenger' | 'driver';

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'role-selection'
  | 'register-phone' 
  | 'register-otp' 
  | 'register-profile' 
  | 'home' 
  | 'destination' 
  | 'searching' 
  | 'riding' 
  | 'payment' 
  | 'rating' 
  | 'history'
  | 'profile'
  | 'driver-home'
  | 'driver-request'
  | 'driver-riding'
  | 'driver-earnings'
  | 'security';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  trips: number;
  plate: string;
  vehicle: string;
}

export interface Trip {
  id: string;
  origin: Location;
  destination: Location;
  price: number;
  date: string;
  status: 'completed' | 'cancelled' | 'ongoing';
  paymentMethod: 'cash' | 'yape' | 'plin';
  driver?: Driver;
}
