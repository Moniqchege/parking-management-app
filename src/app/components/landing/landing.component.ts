import { CommonModule } from '@angular/common';
import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  selectedType = 'daily';
  isLoggedIn = false;
  vehicleNumber = '';
  parkingZone = '';
  vehicleType = '';
  showConfirmation = false;
  showPaymentOptions = false;

  @Output() triggerLogin = new EventEmitter<void>();

  zones = [
    'Nyati Towers – Nairobi CBD',
    'Jade Plaza – Westlands',
    'Fortune Square – Upper Hill',
    'Sapphire Heights – Kilimani',
    'Zenith Arcade – Parklands',
  ];

  vehicleTypes = [
    'Saloon',
    'SUV',
    'Hatchback',
    'Pickup',
    'Motorcycle',
    'Van',
    'Minibus',
    'Bus',
    'Truck',
    'Tuk Tuk',
  ];

  sidebarOpen = false;
  toggleClicked = false;

  onPay() {
    this.showPaymentOptions = true;
  }

  selectParkingType(type: string) {
    if ((type === 'seasonal' || type === 'reserved') && !this.isLoggedIn) {
      this.triggerLogin.emit();
      return;
    }
    this.selectedType = type;
    this.sidebarOpen = false;
    this.showConfirmation = false;
  }

  getHeading() {
    switch (this.selectedType) {
      case 'daily':
        return 'Daily Parking';
      case 'seasonal':
        return 'Seasonal Parking';
      case 'reserved':
        return 'Reserved Parking';
      default:
        return '';
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleClicked = true;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');

    if (
      sidebar &&
      toggleButton &&
      !sidebar.contains(target) &&
      !toggleButton.contains(target) &&
      !this.toggleClicked
    ) {
      this.sidebarOpen = false;
    }

    this.toggleClicked = false;
  }

  submitForm() {
    const plateRegex = /^K[A-Z]{2} \d{3}[A-Z]$/;
    if (!plateRegex.test(this.vehicleNumber)) {
      alert('Enter a valid plate number (e.g., KAA 123A)');
      return;
    }

    if (!this.vehicleType || !this.parkingZone) {
      alert('Please select both vehicle type and parking zone.');
      return;
    }

    this.showConfirmation = true;
  }
}
