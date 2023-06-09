import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actkey } from '../models/actkey.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiURL}/actkeys`;
@Injectable({
  providedIn: 'root'
})
export class ActkeyService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Actkey[]> {
    return this.http.get<Actkey[]>(baseUrl);
  }
}
