import { Component } from '@angular/core';
import { App, Events, NavController, NavParams, Platform } from 'ionic-angular';
import { RegisterNewPage } from '../register-new/register-new';

import { TermsPage } from '../terms/terms';
import { PrivacyPage } from '../privacy/privacy';
import { Keyboard } from '@ionic-native/keyboard';
import { FacebookProvider } from '../../providers/facebook/facebook';
import { GooglePlusProvider } from '../../providers/google-plus/google-plus';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { AuthProvider } from '../../providers/auth/auth';
import { AlertProvider } from '../../providers/alert/alert';
import { TabsPage } from '../tabs/tabs';
import { OnesignalProvider } from '../../providers/onesignal/onesignal';
import { PetAccountPage } from '../pet-account/pet-account';
import { LoaderProvider } from '../../providers/loader/loader';

/**
 * Generated class for the SocialLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-social-login',
  templateUrl: 'social-login.html',
})
export class SocialLoginPage {

  constructor(public navCtrl: NavController, 
    private keyboard: Keyboard,
    public facebookP:FacebookProvider,
    public restApi:RestApiProvider,
    public auth:AuthProvider,
    public app:App,
    public platform:Platform,
    public onesignal:OnesignalProvider,
    public loading:LoaderProvider,
    public events:Events,
    public alertP:AlertProvider,
    public googleP:GooglePlusProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SocialLoginPage');
    let res={
      // email:{value:'check@gmail.com',type:'NO'},
      // fname:{value:'prasoon',type:'NO'},
      // lname:{value:'tare',type:'NO'},
      social_id:{value:'test123',type:'NO'},
      // profilepic:"../assets/imgs/dummy_user.png",
      // fname:'prasoon',
      // lname:'tare',
      // id:'w34e434343443'
    }
    // this.insertAppleData(res);
    // this.restApi.postData(res,'GetUserMeta').then((res1: any) => {
    //   console.log(res1);
    // })
  }

  register(){
    this.navCtrl.push(RegisterNewPage);
  }

  back(){
  this.navCtrl.pop();
  }

  terms(){
    this.navCtrl.push(TermsPage);
  }

    privacy(){
    this.navCtrl.push(PrivacyPage);
  }

  fb_login() {
    this.facebookP.login().then((res:any) => {
      console.log('fb login-----------',res);
      this.socialLogin(res,'fb');
    }).catch((err) => console.error('fb error-------',err));
  }

  google_login() {
    this.googleP.login().then((res:any) => {
      console.log('google plus----------',res);
      this.socialLogin(res,'google');
    }).catch((err) => console.log('google plus error-------',err));
  }


  socialLogin(k: any, type: any) {
    console.log('k-------------', k);
    if (type == 'fb') {
      k['FacebookID'] = k.id;
      k['loginType'] = 'Facebook';
    } else if(type == 'google') {
      k['GmailID'] = k.id;
      k['loginType'] = 'GooglePlus';
    } else if(type=='Apple'){
      k['FacebookID'] = k.id;
      k['loginType'] = 'Facebook';
    }


    let Data = {
      email:{"value": k.email, "type": "NO" },
      first_name:{"value": k.fname, "type": "NO"},
      SessionAuthToke:{value:window.btoa(k.email),"type":"NO"},
    }
    if (type == 'google') {
      Data['GmailID'] = {"value": k.id, "type": "NO" };
      //Data['FacebookID'] = { "value": '', "type": "NO" };
      Data['LoginType'] = {"value": 'GooglePlus', "type": "NO" };
    }
    if (type == 'fb' || type=='Apple') {
      Data['FacebookID'] = {"value": k.id, "type": "NO" };
      //Data['GmailID'] = { "value": '', "type": "NO" };
      Data['LoginType'] = {"value": 'Facebook', "type": "NO" };
    }

    // alert("Social Login Api call - Data we are sending --" + JSON.stringify(Data));
    // if (this.blob_img) {
    //   let m = this.blob_img.type=="image/png"?'png':'jpg';
    //   Data["profilePic"] = {
    //     value: this.blob_img,
    //     type: "IMAGE",
    //     name: this.imageP.generateImageName("hello."+m)
    //   };
    //   console.log("data---------", Data["profile"]);
    // }
    this.restApi.postData(Data, 'SocialLogin').then((result: any) => {
      console.log(result);
      if (result.status == 1) {
            this.auth.updateUserDetails(result.data);
             this.auth.updateUserToken(result.SessionAuthToke);
             this.events.publish('loginAuth','done');
             this.update_deviceId();
             this.app.getRootNav().setRoot(TabsPage);
      } else {
        if (result.data == false) {
          if(!k.email){
            this.navCtrl.push(RegisterNewPage);
          } else {
           let  formData = {
              fname:k.fname,
              fullname:`${k.fname} ${k.lname}`,
              lname:k.lname,
              nick_name:'',
              email:k.email,
              password:"123456",
              cpassword:"123456",
              logintype:k.loginType,
              id:k.id,
            }
            this.navCtrl.push(PetAccountPage, { data:formData ,issocial:1});
          }

        } else {
          this.alertP.show('Alert', result.msg);
        }
      }
    })
  }

  update_deviceId() {
    if(this.platform.is('cordova')){
      this.onesignal.id().then(identity => {
        console.log('-------Device Id----------',identity);
        let Data = {
      user_id:{"value":this.auth.getCurrentUserId(),"type":'NO'},
     device_id:{"value":identity,"type":'NO'},
    }
      this.restApi.postwithoutldr(Data,'update_device_id').then((result:any) => {
      console.log(result);
      })
      })
    }
  }

  applelogin(){
    // this.alertP.showAsync('','Please select “Share My Email” in the next prompt in order to receive email alerts from us relating to your post performance including post expiry reminders, new messages from other users, posts nearby and new posts in your selected categories. If you wouldn’t like to receive these email alerts from us, please select “Hide My Email”').then((res)=>{
      if(this.platform.is("cordova")){
        let this1= this;
        (<any>window).cordova.plugins.SignInWithApple.signin({requestedScopes:[0,1]},
        (d:any)=>{
        //  alert("Apple login success"+JSON.stringify(d));
            let res={
                // email:{value:d.email,type:'NO'},
                // fname:{value:d.fullName.givenName,type:'NO'},
                // lname:{value:d.fullName.familyName,type:'NO'},
                // id:{value:d.user,type:'NO'},
                // profilepic:"../assets/imgs/dummy_user.png",
                // fname:'prasoon',
                // lname:'tare',
                // id:'w34e434343443'
              
              email:d.email,
              fname:d.fullName.givenName,
              lname:d.fullName.familyName,
              id:d.user
            };
    
          let email
          this.loading.show();
       
            res["type"] = "apple";
            console.log("RESssssssssssssssssssssssssssss  apple: ", res);
       
        if (!res.fname&&!res.lname){
    
          let data = {
            // "action": "user_meta"//,
            "social_id":{"value":res.id,"type":"NO"}
          };
          this.restApi.postData(data,'GetUserMeta').then((res1: any) => {
          //  alert("Apple login success get user meta "+JSON.stringify(res));
           this.loading.hide();
    
            if(res1.status==1){
              res.email=res1.data.email;
              res.fname=res1.data.fname;
              res.lname=res1.data.lname;

            
              if (res.email == '' || res.email == undefined || res.email == null) {
            
                email = false
              } else {
                email = true
              }
            //this.createRequest1(res,"apple");
            this.socialLogin(res, 'Apple');
            }
            else{
    
            }
    
          }).catch((err)=>{
            this.loading.hide();
          
          });
        }
        else{
          //alert("Apple login success"+JSON.stringify(res));
          if (res.email == '' || res.email == undefined || res.email == null) {
          
            email = false
          } else {
            email = true
          }
          this.loading.hide();
          this.insertAppleData(res);
          this.socialLogin(res, 'Apple');
          //this.createRequest1(res,"apple");
        }
       
        
        },(err)=>{
        //  alert("apple login error :"+JSON.stringify(err));
          this.loading.hide();   
        })
      }
      else{
        // let res={
        //   email:'check@gmail.com',
        //   profilepic:"../assets/imgs/dummy_user.png",
        //   fname:'prasoon',
        //   lname:'tare',
        //   id:'w34e434343443'
        // }
        // this.insertAppleData(res);
      }

    // })
   
  }



  insertAppleData(res:any){
    let data = {
      email:{value:res.email,type:'NO'},
      fname:{value:res.fname,type:'NO'},
      lname:{value:res.lname,type:'NO'},
      social_id:{value:res.id,type:'NO'},
      // "social_id":res.id,
      // "fname":res.fname,
      // "lname":res.lname,
      // "email":res.email 
    };
    this.restApi.postData(data,'InsertUserMeta').then((result: any) => {
      console.log('inserteddatasuccess',result);
    });
  }
}
