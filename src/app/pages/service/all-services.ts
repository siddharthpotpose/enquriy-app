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

  createCategory(obj:any){
    return this.http.post(`${environment.apiUrl}${'create-category'}`,obj)
  }

  getCategoryData(){
    return this.http.get(`${environment.apiUrl}${'get-categories'}`)
  }

  updateCategoryData(id: any, obj: any) {
  return this.http.put(`${environment.apiUrl}update-category/${id}`,obj);
}

deleteCateory(id:any){
  return this.http.delete(`${environment.apiUrl}delete-category/${id}`)
}

}
