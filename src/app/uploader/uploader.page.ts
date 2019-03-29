import { Component, OnInit, ViewChild } from '@angular/core';
import { Http} from '@angular/http'
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
})
export class UploaderPage implements OnInit {

  imageURL: string
  desc: string
  busy: boolean = false
  scaleCrop: string = '-/scale_crop/200x200'
  noface: boolean = false
  

  effects = {
     effect1: '',
     effect2: '-/exposure/50/-/saturation/50/-/warmth/-30/',
     effect3: '-/filter/vevera/150',
     effect4: '-/filter/carris/150',
     effect5: '-/filter/misiara/150'
  }

  activeEffect: string = this.effects.effect1


  @ViewChild('fileButton') fileButton

  constructor(
    public http: Http,
    public afStore: AngularFirestore,
    public user: UserService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
  }

 async createPost(){
    //it will make busy true and loader will start
    this.busy = true

    const image = this.imageURL
    const desc = this.desc
    const activeEffect = this.activeEffect

    //this is doc which belongs to only one user
    this.afStore.doc(`users/${this.user.getUID()}`).update({
       posts: firestore.FieldValue.arrayUnion(`${image}/${activeEffect}`)
    })

    // this doc is for storing all posts
    this.afStore.doc(`posts/${image}`).set({
      desc,
      author: this.user.getUsername(),
      likes: [],
      effect: activeEffect
    })

    this.busy = false
    //to make spaces free for next upload
    this.imageURL = ""
    this.desc = ""

    const alert = await this.alertController.create({
      header: "Done",
      message: "Your post was created",
      buttons: ['Cool!']
    })

    await alert.present()

    this.router.navigate(['/tabs/feed'])
  }


  uploadFile(){
    this.fileButton.nativeElement.click()
  }

//d87b65897f93a4d2f250
  fileChanged(event){
//it will make busy true and loader will start
    this.busy = true
    
    const files = event.target.files
    const data = new FormData()
    data.append('file', files[0]) 
    data.append("UPLOADCARE_STORE=1", '1')
    data.append("UPLOADCARE_PUB_KEY", 'd87b65897f93a4d2f250' )


    this.http.post('https://upload.uploadcare.com/base/', data)
    .subscribe(event => {
      console.log(event)
      this.imageURL = event.json().file
      this.busy = false // to turn of loader
      this.http.get(`https://ucarecdn.com/${this.imageURL}/detect_faces/`).subscribe(event => {
        //This will return us a json file which contains faces and if it is 0 then there are no faces
        this.noface = event.json().faces == 0 
      })
    })
  }

  setSelected( effect: string){
       this.activeEffect = this.effects[effect]
  }

}
