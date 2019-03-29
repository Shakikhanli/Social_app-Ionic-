import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app'

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  postID: string
  post
  heartType: string = "heart-empty"
  postReference: AngularFirestoreDocument
  sub
  effect: string = ''

  constructor(
    private route: ActivatedRoute, 
    private afs: AngularFirestore,
    private user: UserService
  ) {
    
   }

//we are get here post Id and other info of post 
  ngOnInit() {

    //paramMap here contains all of us parameters and we get our id from here
    this.postID = this.route.snapshot.paramMap.get('id')

    /* 
    here we take all post info postID we using here is same with "image" which 
    we used in uploader.page.ts this unique ID is same so we can take our post with it. 
    We are also subscribing to it to take value which will help us to calculate likes
    */
    this.postReference =  this.afs.doc(`posts/${this.postID}`)
    this.sub =  this.postReference.valueChanges().subscribe(val => {
      this.post = val
      this.effect = val.effect
      //it is to check that user already liked or not
      this.heartType = val.likes.includes(this.user.getUID()) ? "heart" : "heart-empty"

    })
  }

  ngOnDestroy() {
    this.sub.unsubscribed()

  }

  toggleHeart(){
    if(this.heartType == 'heart-empty'){
      this.postReference.update({
        likes: firestore.FieldValue.arrayUnion(this.user.getUID())
        
      })
    } else {
      this.postReference.update({
				likes: firestore.FieldValue.arrayRemove(this.user.getUID())
			})
    }
  }

}
