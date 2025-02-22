import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  //private apiUrl = 'https://localhost:7000/api/Business';
  //private cus_ApiUrl = 'https://localhost:7000/api/Customer';
  
  private apiUrl = 'https://business-11.onrender.com/api/Business';
  private cus_ApiUrl = 'https://business-11.onrender.com/api/Customer';

  constructor(private http: HttpClient) {}

  registerBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  updateBusiness(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}`, formData);
  }

  checkEmailExists(email: string): Observable<boolean> {
    debugger
    return this.http.get<boolean>(`${this.cus_ApiUrl}/check-email?email=${email}`);
  }
  checkEmailExistsBusiness(email: string): Observable<boolean> {
    debugger
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  getCustomerDetailsByID(cusId: number): Observable<any> {
    debugger
    return this.http.get<any>(`${this.cus_ApiUrl}/getcusdetailsbyid?cusId=${cusId}`);
  }  

  registerCustomer(inputdata:any)
  {
    return this.http.post(this.cus_ApiUrl, inputdata);
  }

  searchBusinesses(category: string, subcategory: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?category=${category}&subcategory=${subcategory}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetCategories`);
  }

  getImage(imagename: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getSubCategories(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetSubCategories/${categoryId}`);
  }
  getBusinessDetailById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getbusinessdetailbyid/${id}`);
  }
}
