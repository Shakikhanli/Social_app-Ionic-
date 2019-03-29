import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app'

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

    /*
    Because firebase don't let us change the passwor of old user we have to reAuthenticate it. 
    In order to be able to do it we need username and old password of user
    */
    reAuth(username: string, password: string){
       return this.afAuth.auth.currentUser.reauthenticateWithCredential(auth.EmailAuthProvider.credential(username + '@ulvi.com', password))
    }

    // This function provided by firebase so don't need new one
    updatePassword(newpassword: string){
      return this.afAuth.auth.currentUser.updatePassword(newpassword) 
    }

    updateEmail(newemail: string){
        return this.afAuth.auth.currentUser.updateEmail(newemail+'@ulvi.com')
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