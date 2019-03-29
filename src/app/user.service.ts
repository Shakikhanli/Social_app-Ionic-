import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

interface user {
    username: string,
    uid: string
}

@Injectable()
export class UserService{
    private user: user

    constructor(private afAuth: AngularFireAuth){

    }

    setUser(user: user){
      this.user = user
    }

    getUsername(): string{
        return this.user.username
    }


 async isAuthenticated(){
     if(this.user) return true

     //authState check user logged in or not. authState returns us an observable value so we don't need it
     // that's why we use toPromise and taking first value with first
     const user = await this.afAuth.authState.pipe(first()).toPromise()

     //If user logged in firebase but our app don't know that  
     if (user){
         this.setUser({
            username: user.email.split('@')[0],
            uid: user.uid
         })
         return true

     }
     return false
 }


// this method is needed to get uid (user id)   
getUID(): string {
    return this.user.uid
}
}