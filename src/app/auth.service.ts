import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';


@Injectable()
export class AuthService implements CanActivate{
    
//we are using router to navigate other place if we not logged in
// and UserService provides acces for us to user in order to see if we logged in
    constructor(private router: Router, private user: UserService){

    }

    async canActivate(router){
        if(this.user.isAuthenticated()){
            return true
        } 
        this.router.navigate(['/login'])
        return false
     
    }



}