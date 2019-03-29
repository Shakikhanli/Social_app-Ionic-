import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'

import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../user.service';

import { AlertController } from '@ionic/angular' 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string = ""

  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public afStore: AngularFirestore,
    public user: UserService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }


  async presentAlert(title: string, content: string){
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })

  }

  async register(){
    const {username, password, cpassword} = this
    if (password != cpassword){
      return console.error("Passwords do not match")
    }

    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username+"@ulvi.com", password)

//Here we are creating a user document and saving user with information inside set()
      this.afStore.doc(`users/${res.user.uid}`).set({
        username
      }) 

      this.presentAlert("Success", 'You are registered!')

      this.router.navigate(['/tabs'])
    } catch(error){
      console.dir(error)
    }
  }

  // function to show alert
  // async showAlert(header: string, message: string){
  //   const alert = await this.alert.create({
  //     header,
  //     message,
  //     buttons: ["Ok"]
  //   })   

  //   await alert.present()
  // }

}
