import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';

const AUTH_URL = environment.api_url + '/user/'

@Injectable({
    providedIn: "root"
})
export class AuthService{
    private isAuthenticate = false
    private token: string;
    private authStatusListener = new Subject<boolean>()

    private tokenTimer: any

    constructor(private http: HttpClient, private router: Router){}

    private userId: string

    getToken(){
        return this.token
    }

    getIsAuth(){
        return this.isAuthenticate
    }

    getuserId(){
        return this.userId
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable()
    }
    
    createUser(email: string, password: string){
        const authData: AuthData = {email: email, password: password}
        this.http.post(AUTH_URL + "/signup", authData)
        .subscribe(() => {
            this.router.navigate(['/auth/login'])
        }, error => {
            this.authStatusListener.next(false)
        })
    }

    login(email: string, password: string){
        const authData: AuthData = {email: email, password: password}

        this.http.post<{token: string, expiresIn: number, userId: string}>(AUTH_URL + "/login", authData)
        .subscribe(response => {
            const token = response.token
            this.token = token

            if(token){
                const expiresInDuration = response.expiresIn
                this.setAuthTimer(expiresInDuration)

                this.isAuthenticate = true
                this.authStatusListener.next(true)
                
                this.userId = response.userId

                const now = new Date()
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
                this.saveAuthData(token, expirationDate, this.userId)
                this.router.navigate(["/"])
            }
        }, error => {
            this.authStatusListener.next(false)
        })
    }

    autoAuthUser(){
        const authInformation = this.getAuthDate()
        
        if(!authInformation)
            return
            
        const now = new Date()
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime()

        if(expiresIn > 0){
            this.token = authInformation.token
            this.isAuthenticate = true
            this.userId = authInformation.userId
            this.setAuthTimer(expiresIn / 1000)
            this.authStatusListener.next(true)
        }
    }

    logout(){
        this.token = null
        this.isAuthenticate = false
        this.authStatusListener.next(false)
        clearTimeout(this.tokenTimer)
        this.userId = null
        this.clearAuthData()
        this.router.navigate(["/auth/login"])
    }

    

    private setAuthTimer(duration: number){
        this.tokenTimer = setTimeout(() => {
            this.logout()
        }, duration * 1000);
    }
    private saveAuthData(token: string, expirationDate: Date, userId: string){
        localStorage.setItem('token', token)
        localStorage.setItem('expiration', expirationDate.toISOString())
        localStorage.setItem("userId", userId)
    }

    private clearAuthData(){
        localStorage.removeItem("token")
        localStorage.removeItem("expiration")
        localStorage.removeItem("userId")
    }

    getAuthDate(){
        const token = localStorage.getItem("token")
        const expirationDate = localStorage.getItem("expiration")
        const userId = localStorage.getItem("userId")
        
        if(!token || !expirationDate){
            return
        }

        return{
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }
}