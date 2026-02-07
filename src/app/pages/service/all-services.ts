import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllServices {
  
  constructor(private http: HttpClient){}


  getAllCategory(){
    return this.http.get(`${environment.apiUrl}${'get-categories'}`)
  }

  getAllStatus(){
    return this.http.get(`${environment.apiUrl}${'get-statuses'}`)
  }

  createEnquiry(obj:any){
   return this.http.post(`${environment.apiUrl}${'create-enquiry'}`,obj)  }


}
