import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent } from '../models/agent.model';
import { environment } from 'src/environments/environment';
import { Installedapp } from '../models/installedapp.model';

const baseUrl = `${environment.apiURL}/agents`;
@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(baseUrl);
  }

  get(id: any): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${baseUrl}?actkey=${id}`)
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${baseUrl}?title=${title}`);
  }
}
