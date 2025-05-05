import { Injectable } from '@angular/core';
import * as models from '../models/parking.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly STORAGE_KEY = 'parking-management-data';

  private data: {
    users: models.User[];
    parkingSites: models.ParkingSite[];
    parkingBuildings: models.ParkingBuilding[];
    vehicleTypes: models.VehicleType[];
    vehicles: models.Vehicle[];
    parkingSessions: models.ParkingSession[];
  } = {
    users: [],
    parkingSites: [],
    parkingBuildings: [],
    vehicleTypes: [],
    vehicles: [],
    parkingSessions: []
  };

  constructor() {
    this.loadData();
    this.initializeSampleData();
  }

  private loadData(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
  }

  private saveData(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  private initializeSampleData(): void {
    if (this.data.users.length === 0) {
      // Add sample super admin
      this.data.users.push({
        id: this.generateId(),
        username: 'admin',
        password: 'admin123',
        role: 'super-admin',
        name: 'Super Admin',
        email: 'admin@parking.com'
      });

      // Add sample vehicle types
      this.data.vehicleTypes.push(
        { id: this.generateId(), name: 'Car', hourlyRate: 2, dailyRate: 15 },
        { id: this.generateId(), name: 'Motorcycle', hourlyRate: 1, dailyRate: 7 },
        { id: this.generateId(), name: 'Truck', hourlyRate: 4, dailyRate: 25 }
      );

      this.saveData();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // User methods
  getUsers(): models.User[] {
    return [...this.data.users];
  }

  addUser(user: Omit<models.User, 'id'>): models.User {
    const newUser = { ...user, id: this.generateId() };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Parking site methods
  getParkingSites(): models.ParkingSite[] {
    return [...this.data.parkingSites];
  }

  addParkingSite(site: Omit<models.ParkingSite, 'id'>): models.ParkingSite {
    const newSite = { ...site, id: this.generateId() };
    this.data.parkingSites.push(newSite);
    this.saveData();
    return newSite;
  }

  // Parking building methods
  addParkingBuilding(building: Omit<models.ParkingBuilding, 'id' | 'floors'> & { floors: Omit<models.ParkingFloor, 'id'>[] }): models.ParkingBuilding {
    const newBuilding = {
      ...building,
      id: this.generateId(),
      floors: building.floors.map(floor => ({
        ...floor,
        id: this.generateId(),
        occupiedSpaces: 0
      }))
    };
    this.data.parkingBuildings.push(newBuilding);
    this.saveData();
    return newBuilding;
  }

  // Vehicle methods
  addVehicle(vehicle: Omit<models.Vehicle, 'id'>): models.Vehicle {
    const newVehicle = { ...vehicle, id: this.generateId() };
    this.data.vehicles.push(newVehicle);
    this.saveData();
    return newVehicle;
  }

  // Parking session methods
  startParkingSession(session: Omit<models.ParkingSession, 'id' | 'status' | 'entryTime'>): models.ParkingSession {
    const newSession = {
      ...session,
      id: this.generateId(),
      status: 'active' as const,
      entryTime: new Date().toISOString()
    };
    this.data.parkingSessions.push(newSession);
    
    // Update occupied spaces count
    const building = this.data.parkingBuildings.find(b => 
      b.floors.some(f => f.id === session.spaceId)
    );
    if (building) {
      const floor = building.floors.find(f => f.id === session.spaceId);
      if (floor) {
        floor.occupiedSpaces++;
      }
    }
    
    this.saveData();
    return newSession;
  }

  endParkingSession(sessionId: string, amountPaid: number): models.ParkingSession {
    const session = this.data.parkingSessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    
    session.exitTime = new Date().toISOString();
    session.status = 'completed' as const;
    session.amountPaid = amountPaid;
    
    // Update occupied spaces count
    const building = this.data.parkingBuildings.find(b => 
      b.floors.some(f => f.id === session.spaceId)
    );
    if (building) {
      const floor = building.floors.find(f => f.id === session.spaceId);
      if (floor) {
        floor.occupiedSpaces--;
      }
    }
    
    this.saveData();
    return session;
  }

  // Authentication methods
  login(username: string, password: string): models.User | null {
    const user = this.data.users.find(u => 
      u.username === username && u.password === password
    );
    return user ? { ...user } : null;
  }
}