import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ParkingBuilding, ParkingFloor } from '../../core/models/parking.model';

@Component({
  selector: 'app-entry-gate',
  imports: [FormsModule, CommonModule],
  templateUrl: './entry-gate.component.html',
  styleUrl: './entry-gate.component.css'
})
export class EntryGateComponent {
  licensePlate = '';
  vehicleTypeId = '';
  spaceId = '';
  lastEntry: any = null;
  
  vehicleTypes: any[] = [];
  availableSpaces: any[] = [];

  constructor(private dataService: DataService, public authService: AuthService) {
    this.loadData();
  }

  loadData(): void {
    this.vehicleTypes = (this.dataService as any).data.vehicleTypes;
    this.availableSpaces = [];
    (this.dataService as any).data.parkingBuildings.forEach((building: ParkingBuilding) => {
      building.floors.forEach((floor: ParkingFloor) => {
        if (floor.occupiedSpaces < floor.totalSpaces) {
          this.availableSpaces.push({
            id: floor.id,
            buildingName: building.name,
            floorNumber: floor.floorNumber,
            available: floor.totalSpaces - floor.occupiedSpaces
          });
        }
      });
    });
    
    if (this.vehicleTypes.length > 0) {
      this.vehicleTypeId = this.vehicleTypes[0].id;
    }
    if (this.availableSpaces.length > 0) {
      this.spaceId = this.availableSpaces[0].id;
    }
  }
  getSpaceDescription(space: any): string {
    return `${space.buildingName} - Floor ${space.floorNumber} (${space.available} available)`;
  }
  getSpaceDescriptionById(spaceId: string): string {
    const space = this.availableSpaces.find(s => s.id === spaceId);
    return space ? this.getSpaceDescription(space) : 'Unknown space';
  }
  registerEntry(): void {
    // Add vehicle if not exists
    let vehicle = (this.dataService as any).data.vehicles.find((v: any) => v.licensePlate === this.licensePlate);
    if (!vehicle) {
      vehicle = this.dataService.addVehicle({
        licensePlate: this.licensePlate,
        typeId: this.vehicleTypeId
      });
    }

    // Start parking session
    this.lastEntry = this.dataService.startParkingSession({
      vehicleId: vehicle.id,
      spaceId: this.spaceId,
    });
    
    // Reset form
    this.licensePlate = '';
    this.loadData();
  }
}
