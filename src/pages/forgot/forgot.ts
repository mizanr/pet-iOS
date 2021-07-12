import { RestApiProvider } from './../../providers/rest-api/rest-api';
import { Component } from '@angular/core';
import { NavController, NavParams,ModalController} from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import{OptPage} from '../opt/opt';
import { AuthProvider } from './../../providers/auth/auth';
import { CreatePassPage } from '../create-pass/create-pass';

/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  data={
    email:""
  }
  constructor(
    public navCtrl: NavController, 
    public api:RestApiProvider,
    public alertP:AlertProvider,
    public auth:AuthProvider,
    public modalCtrl:ModalController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }

  submit(){

      let data={
          "email":{value:this.data.email.trim(), type:"EMAIL"},
          "SessionAuthToke":{value:window.btoa(this.data.email.trim()), type:"NO"},
        }
      
       this.api.postData(data,"forgot_password").then((res:any)=>{
           if(res.success == 1){
             // this.auth.updateUserToken(res.SessionAuthToke);
             var m = this.modalCtrl.create(OptPage,{email:this.data.email.trim(),id:res.userdata.id,token:res.SessionAuthToke});
              m.present();
              m.onDidDismiss((data) => {
                if(data) {
                  this.navCtrl.push(CreatePassPage,{id:data.id,token:data.token});
                }
              })
           
           } else {
             this.alertP.show('Alert',res.msg);
           }
   
       }).catch((err)=>{
             this.alertP.presentToast(err.error.Message,'bottom')
       })
     
  }
}
