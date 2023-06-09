import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiURL}/auth`;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  
  signup(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${baseUrl}/signup`, data);
  }
  
  signin(data: any): Observable<any> {
    console.log(data);
    // let headers = new HttpHeaders()
    //   .set('content-type', 'application/json')
    //   // .set('Content-Type', 'multipart/form-data')
    //   .set('Accept', 'application/json')
    //   .set('Access-Control-Allow-Origin', 'false');;
    return this.http.post(`${baseUrl}/signin`, data);
  }
}
