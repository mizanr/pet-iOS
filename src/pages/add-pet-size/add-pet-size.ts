import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth/auth';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AddPetSizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-pet-size',
  templateUrl: 'add-pet-size.html',
})
export class AddPetSizePage {
  formData:any = {
    pet_name:'',
    race:'',
    raceid:'',
    color:'',
    colorid:'',
    weight:'',
    coat:'',
    coatid:'',
    gendar:'',
    breed:'',
    breedid:'',
    size:'',
    cover_img:'',
    cover_blob:'',
    cover_name:'',
    img:'',
    img_blob:'',
    img_name:'',
    pet_id:'0',
    wall_image:'',
    profile:'',
  }

all_data:any;

isxlarge=false;
islarge=false;
ismedium=false;
issmall=false;
isupdate:any;

  constructor(public navCtrl: NavController,
    public events:Events, 
    public restApi:RestApiProvider,
    public auth:AuthProvider,
    public alertP:AlertProvider,
    public navParams: NavParams) {
      this.formData= navParams.data.data;
      this.isupdate = navParams.data.isupdate || 0;
      
      let size = navParams.data.size;
      console.log('pet size------',size);
      if(size=='x-large'){
       this.isxlarge=true;
      }else if(size=='large'){
       this.islarge=true;
      }else if(size=='medium'){
       this.ismedium=true;
      }else if(size=='small'){
        this.issmall=true;
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPetSizePage');
  }

  size_change(size:any) {
    if(size=='x'){
      this.formData.size='x-large';
      this.events.publish('back_',this.formData);
      if(this.formData.pet_id>'0'){
        this.update_pet();
      }
    }else if(size=='l'){
      this.formData.size='large';
      this.events.publish('back_',this.formData);
      if(this.formData.pet_id>'0'){
        this.update_pet();
      }
    }else if(size=='m'){
      this.formData.size='medium';
      this.events.publish('back_',this.formData);
      if(this.formData.pet_id>'0'){
        this.update_pet();
      }
    }else if(size=='s'){
      this.formData.size='small';
      this.events.publish('back_',this.formData);
      if(this.formData.pet_id>'0'){
        this.update_pet();
      }
    }
  }

  update_pet() {
    // let Data = {
    //   id:{value:this.formData.pet_id,type:"NO"},
    //   user_id:{"value":this.auth.getCurrentUserId(),"type":"NO"},
    //   name:{"value":this.formData.pet_name,"type":"PNAME"},
    //   gender:{"value":this.formData.gendar,"type":"NO"},
    //   dob:{"value":'',"type":"NO"},
    //   race:{"value":'',"type":"NO"},
    //   breed:{"value":this.formData.breed,"type":"NO"},
    //   coat:{"value":this.formData.coat,"type":"COAT"},
    //   color:{"value":this.formData.color,"type":"COLR"},
    //   behaviour:{"value":'',"type":"NO"},
    //   size:{"value":this.formData.size,"type":"NO"},
    //   weight:{"value":this.formData.weight,"type":"NO"},
    // }
    let Data = {
      id:{value:this.formData.pet_id,type:"NO"},
      user_id:{"value":this.auth.getCurrentUserId(),"type":"NO"},
      name:{"value":this.formData.pet_name,"type":"PNAME"},
      gender:{"value":this.formData.gendar,"type":"NO"},
      dob:{"value":'',"type":"NO"},
      race:{"value":this.formData.race,"type":"NO"},
      raceid:{"value":this.formData.raceid,"type":"NO"},
      breed:{"value":this.formData.breed,"type":"NO"},
      breedid:{"value":this.formData.breedid,"type":"NO"},
      coat:{"value":this.formData.coat,"type":"NO"},
      coatid:{"value":this.formData.coatid,"type":"NO"},
      color:{"value":this.formData.color,"type":"NO"},
      colorid:{"value":this.formData.colorid,"type":"NO"},
      behaviour:{"value":'',"type":"NO"},
      size:{"value":this.formData.size,"type":"NO"},
      weight:{"value":this.formData.weight,"type":"NO"},
    }
    if(this.formData.img_blob){
      Data['profile'] = {"value":this.formData.img_blob,"type":"IMAGE1","name":this.formData.img_name};
    }

    if(this.formData.cover_blob){
      Data['wall_image'] = {"value":this.formData.cover_blob,"type":"IMAGE1","name":this.formData.cover_name};
    }
    this.restApi.postData2(Data,0,'edit_pet').then((result:any) => {
      if(result.status == 1){
        console.log(result);
        this.navCtrl.pop();  
        // this.navCtrl.setRoot(TabsPage, { tabindex: 3 });     
      } else {
        this.alertP.show('Alert',result.msg);
      }
    });
  }

}
