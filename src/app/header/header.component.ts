import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
    private authListenerSubs: Subscription
    userIsAuthenticated = false
    
    constructor(private authService: AuthService){}

    onLogout(){
        this.authService.logout()
    }

    ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuth()
        this.authListenerSubs = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated
        })
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe()
    }
}
