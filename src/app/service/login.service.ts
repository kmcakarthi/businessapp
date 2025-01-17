import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
apiurl='http://192.168.20.2:8040/api/Auth/login';
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
