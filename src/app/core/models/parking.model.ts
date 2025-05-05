export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  clientId?: string;
  role: 'super-admin' | 'client' | 'entry-operator' | 'exit-operator';
}

export interface ParkingSite {
  id: string;
  clientId: string;
  name: string;
  address: string;
}

export interface ParkingBuilding {
  id: string;
  siteId: string;
  name: string;
  floors: ParkingFloor[];
}

export interface ParkingFloor {
  id: string;
  buildingId: string;
  floorNumber: number;
  totalSpaces: number;
  occupiedSpaces: number;
}

export interface VehicleType {
  id: string;
  name: string;
  hourlyRate: number;
  dailyRate: number;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  typeId: string;
}

export interface ParkingSession {
  id: string;
  vehicleId: string;
  entryTime: string;
  exitTime?: string;
  spaceId: string;
  status: 'active' | 'completed';
  amountPaid?: number;
}
