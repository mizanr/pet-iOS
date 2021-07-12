import { LoaderProvider } from './../loader/loader';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { compareDates } from 'ionic-angular/umd/util/datetime-util';
import { GooglePlus } from '@ionic-native/google-plus';
import { LoadingController, Platform } from 'ionic-angular';
/*

***************************Important Content****************************************

1. ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.1017928988090-hp81g9sjh9rkuv7s6h3ekkl7gro9ab7b

// 83263915323-i3gc23ps34pk02bi5ltgg95ac69bfif2.apps.googleusercontent.com
83263915323-epj740ne5ocatmttnsp6ae5sjg6sejjb.apps.googleusercontent.com
prasoon sir office google account using 
google login Petapp.

2. npm install --save @ionic-native/google-plus@4



*/

@Injectable()
export class GooglePlusProvider {

  constructor(
    public http: HttpClient,
    private googlePlus: GooglePlus,
    public platform:Platform,
    private loading: LoaderProvider
  ) {
    console.log('Hello GooglePlusProvider Provider');

  }

  login() {

    this.loading.show();
    return new Promise((resolve, reject) => {
      if(this.platform.is('cordova')) {
        this.googlePlus.login({}).then(res => {
          console.log('res=================google plus page: ',res);
          this.loading.hide();
          let data = {
            "fname": res.givenName,
            "lname": res.familyName,
            "email": res.email,
            "profilepic": res.imageUrl,
            "id": res.userId
          }
          resolve(data);
        }).catch(err => {
          console.log("this is google login error", err);
          this.loading.hide();
          // alert("Error:  "+JSON.stringify(err));
          reject(err);
        });
      } else {
        reject(0);
        this.loading.hide();
      }
    })
  }




}
