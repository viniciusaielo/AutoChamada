
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {GooglePlus} from '@ionic-native/google-plus';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthProvider {

  public userProfile: any;

  constructor( public googlePlus: GooglePlus) {
    firebase.initializeApp(environment.firebaseConfig);

    //Set up a listener for the when the AuthState changes (Login/Logout) and perform some action.
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        this.userProfile = user;
      } else { 
          this.userProfile = null;
      }
    });
  }

  googleLogin(): Promise<any> {
    return new Promise((resolve, reject) => { 
        this.googlePlus.login({
          'webClientId': '430516516051-eu770ml8sp8204v9tislcdtlp4ur2aji.apps.googleusercontent.com',
          'offline': true
        }).then( res => {
                const googleCredential = firebase.auth.GoogleAuthProvider 
                    .credential(res.idToken);
  
                firebase.auth().signInWithCredential(googleCredential)
              .then( response => {
                  console.log("Firebase success: " + JSON.stringify(response));
                  resolve(response)
              });
        }, err => {
            console.error("Error: ", err)
            reject(err);
        });
    });
  }

}
