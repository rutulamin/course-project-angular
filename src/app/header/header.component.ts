import { Component, OnInit } from '@angular/core';
import { DataStoredService } from '../shared/data-stored.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth = false;
  subscription: Subscription;

  constructor(private dsService: DataStoredService, private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(
      (userData) => {
        this.isAuth = !!userData;
      }
    );
  }

  onSaveData() {
    this.dsService.saveData();
  }
  onFetchData() {
  
    this.dsService.fetchData().subscribe();
  }
  onLogout() {
    this.authService.onLogout()
  }
}
