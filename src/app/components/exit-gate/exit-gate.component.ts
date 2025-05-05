import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-exit-gate',
  imports: [FormsModule, CommonModule],
  templateUrl: './exit-gate.component.html',
  styleUrl: './exit-gate.component.css'
})
export class ExitGateComponent {
  licensePlate = '';
  activeSession: any = null;
  paymentMethod = 'cash';
  exitCompleted = false;
  receiptNumber = '';
  amountPaid = 0;
  
  currentRate = 2; // Default hourly rate

  constructor(private dataService: DataService, public authService: AuthService) {}

  processExit(): void {
    // Find vehicle by license plate
    const vehicle = (this.dataService as any).data.vehicles.find((v: any) => v.licensePlate === this.licensePlate);
    if (!vehicle) {
      alert('Vehicle not found');
      return;
    }

    // Find active session for this vehicle
    this.activeSession = (this.dataService as any).data.parkingSessions.find((s: any) => 
      s.vehicleId === vehicle.id && s.status === 'active'
    );

    if (!this.activeSession) {
      alert('No active session found for this vehicle');
      return;
    }

    // Get vehicle type rate
    const vehicleType = (this.dataService as any).data.vehicleTypes.find((t: any) => t.id === vehicle.typeId);
    this.currentRate = vehicleType ? vehicleType.hourlyRate : 2;
  }

  calculateDuration(): string {
    if (!this.activeSession) return '';
    
    const entryTime = new Date(this.activeSession.entryTime);
    const now = new Date();
    const diffMs = now.getTime() - entryTime.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  calculateTotal(): number {
    if (!this.activeSession) return 0;
    
    const entryTime = new Date(this.activeSession.entryTime);
    const now = new Date();
    const diffHours = (now.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
    
    // Round up to nearest hour
    const hours = Math.ceil(diffHours);
    return hours * this.currentRate;
  }

  completeExit(): void {
    this.amountPaid = this.calculateTotal();
    this.receiptNumber = 'RCP-' + Math.floor(Math.random() * 1000000);
    
    this.dataService.endParkingSession(this.activeSession.id, this.amountPaid);
    
    this.exitCompleted = true;
    this.activeSession = null;
    this.licensePlate = '';
  }
}
