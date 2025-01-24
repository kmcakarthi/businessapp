import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  // private apiUrl = 'http://192.168.20.2:8040/api/Business';
  // private cus_ApiUrl = 'http://192.168.20.2:8040/api/Customer';

  // private apiUrl = 'https://localhost:7000/api/Business';
  // private cus_ApiUrl = 'https://localhost:7000/api/Customer';

  private apiUrl = 'https://reg-apis.onrender.com/api/Business';
  private cus_ApiUrl = 'https://reg-apis.onrender.com/api/Customer';


  constructor(private http: HttpClient) {}

  registerBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  updateBusiness(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}`, formData);
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
