import { HttpClient, HttpParams } from '@angular/common/http';
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

  login(obj:any){
    return this.http.post(`${environment.apiLoginUrl}${'login'}`,obj)
  }

  getEnquiries(page:any,pageSize:any){
      const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);

    return this.http.get(`${environment.apiUrl}${'get-enquiries'}`,{params})
  }


}
