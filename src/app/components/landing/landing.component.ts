import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  selectedType = 'daily';
  isLoggedIn = false; // simulate login check
  vehicleNumber = '';
  parkingZone = '';
  zones = ['Zone A', 'Zone B', 'Zone C'];

  selectParkingType(type: string) {
    this.selectedType = type;
  }

  getHeading() {
    switch (this.selectedType) {
      case 'daily': return 'Daily Parking';
      case 'seasonal': return 'Seasonal Parking';
      case 'reserved': return 'Reserved Parking';
      default: return '';
    }
  }

  openLoginModal() {
    // your login modal logic
    alert('Login required for this option.');
  }

  submitForm() {
    // handle form submission
    console.log(this.vehicleNumber, this.parkingZone);
  }
}
