import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  subscription: Subscription;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, private router: Router, private cfr: ComponentFactoryResolver) { }

  ngOnInit() {
  }
  ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
  onChangeMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onClosed() {
    this.error = null;
  }
  onSubmit(f: NgForm) {
    if (!f.valid) {
      return;
    }
    const email = f.value.email;
    const password = f.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
        authObs = this.authService.onLogin(email, password);
    } else {
        authObs = this.authService.onSigup(email, password);
    }
    authObs.subscribe(
        resData => {
            console.log(resData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        },
        err => {
            this.error = err;
            this.showErrorAlert(err);
            this.isLoading = false;
        }
    );
    f.reset();
  }

  private showErrorAlert(message: string) {
    const alertCmpFactory = this.cfr.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerref;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(
        () => {
            this.subscription.unsubscribe();
            hostViewContainerRef.clear();
        }
    );
  }
}
