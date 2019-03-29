import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  mainuser: AngularFirestoreDocument
  sub
  username: string
  profilePic: string
  busy: boolean=false
  password: string
  newpassword: string

  //we need it to get reffrance to fileBtn
  @ViewChild('fileBtn') fileBtn: {
    nativeElement: HTMLElement
  }
  
  
  constructor(
    private http: Http, 
    private afs: AngularFirestore,
    private user: UserService,
    private router: Router,
    private alertController: AlertController){ 
    this.mainuser = afs.doc(`user/${user.getUID()}`)
    this.sub = this.mainuser.valueChanges().subscribe(event => {
      this.username = event.username
      this.profilePic = event.profilePic
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.sub.unsubscribe()
  }

  updateProfilePic(){
    this.fileBtn.nativeElement.click()
  }

  uploadPic(event){
    const files = event.target.files
    
    const data = new FormData()
    data.append('file', files[0])
    data.append('file', files[0]) 
    data.append("UPLOADCARE_STORE=1", '1')
    data.append("UPLOADCARE_PUB_KEY", 'd87b65897f93a4d2f250' )


    this.http.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
       
      // we need to add profile picture to user
      const uuid = event.json().file
      this.mainuser.update({
        profilePic: uuid 
      })

    })
  }

  async presentAlert(title: string, content: string){
    const alert = await this.alertController.create({
      header: title,
      message: content,
      buttons: ['OK']
    })

    await alert.present()
  }

  async updateDetails(){
    this.busy = true

    if (!this.password){
      this.busy = false
      return this.presentAlert('Error!', 'You have to enter a password')
    }

    try{
      await this.user.reAuth(this.user.getUsername(), this.password)
    }catch(error){
      this.busy = false
      return this.presentAlert('Error!', 'Wrong Password')
    } 
    

    if(this.newpassword){
       await this.user.updatePassword(this.newpassword)
    }

    if(this.username !== this.user.getUsername()){
      await this.user.updateEmail(this.username)
      this.mainuser.update({
        username: this.username
      })
    }

    this.password = ""
    this.newpassword = ""
    this.busy = false

    await this.presentAlert('Done!', 'Your profile is updated')

    this.router.navigate(['tabs/feed'])


  }

}
