import { Component, inject } from '@angular/core';
import { AllServices } from '../service/all-services';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../share/alert/alert.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  http = inject(HttpClient)

  constructor(private service: AllServices, private alertService : AlertService){
    this.http.get('https://api.freeprojectapi.com/api/UserApp/GetAllUsers').subscribe(({
      next:(res:any)=>{
        console.log(res.data);
        this.alertService.success(res.message)


      }
    }))
  }

  

}
