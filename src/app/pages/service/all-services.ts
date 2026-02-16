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

   updateEnquiry(obj:any, id:any){
    return this.http.put(`${environment.apiUrl}update-enquiry/${id}`,obj)
   }

   getEnquiryById(id:any){
    return this.http.get(`${environment.apiUrl}get-enquiry/${id}`)
   }



  login(obj:any){
    return this.http.post(`${environment.apiLoginUrl}${'login'}`,obj)
  }

  getEnquiries(page:any,pageSize:any){
      const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);

    return this.http.get(`${environment.apiUrl}${'get-enquiries'}`,{params})
  }

  createCategory(obj:any){
    return this.http.post(`${environment.apiUrl}${'create-category'}`,obj)
  }

  getCategoryData(){
    return this.http.get(`${environment.apiUrl}${'get-categories'}`)
  }

  updateCategoryData(id: any, obj: any) {
  return this.http.put(`${environment.apiUrl}update-category/${id}`,obj);
 }

  deleteCateory(id: any, remark?: string) {
    let params = new HttpParams();
    if (remark) {
      params = params.set('remark', remark);
    }
    return this.http.delete(`${environment.apiUrl}delete-category/${id}`, { params })
  }

}
