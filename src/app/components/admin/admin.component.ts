import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/models/parking.model';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [];
  newUser: Omit<User, 'id'> = {
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'client'
  };

  constructor(private dataService: DataService, public authService: AuthService) {
    this.users = this.dataService.getUsers();
  }

  createUser(): void {
    this.dataService.addUser(this.newUser);
    this.users = this.dataService.getUsers();
    this.newUser = {
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'client'
    };
  }
}

