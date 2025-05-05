import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-portal',
  imports: [ FormsModule, CommonModule],
  templateUrl: './client-portal.component.html',
  styleUrl: './client-portal.component.css'
})
export class ClientPortalComponent {
  mySites: any[] = [];
  newSite = {
    name: '',
    address: ''
  };

  constructor(private dataService: DataService, public authService: AuthService) {
    this.loadMySites();
  }

  loadMySites(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.mySites = (this.dataService as any).data.parkingSites.filter((site: any) => 
        site.clientId === user.clientId || user.role === 'super-admin'
      );
    }
  }

  getBuildingsForSite(siteId: string): any[] {
    return (this.dataService as any).data.parkingBuildings.filter((b: any) => b.siteId === siteId);
  }

  addParkingSite(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.dataService.addParkingSite({
        clientId: user.clientId || user.id, // For demo, use id if no clientId
        name: this.newSite.name,
        address: this.newSite.address
      });
      
      this.newSite = { name: '', address: '' };
      this.loadMySites();
    }
  }
}
