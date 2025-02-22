import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //apiurl='https://localhost:7000/api/Auth/login';
  apiurl='https://business-11.onrender.com/api/Auth/login';

  constructor(private http: HttpClient) { }

  onSubmit(usercred:any)
  {
     return this.http.post(this.apiurl, usercred)
  }
  IsLogged()
  {
    return localStorage.getItem("token")!=null;
  }
  GetToken()
  {
    return localStorage.getItem("token") || '';
  }
}
