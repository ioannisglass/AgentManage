import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Installedapp } from '../models/installedapp.model';
import { environment } from 'src/environments/environment';

const baseUrl = `${environment.apiURL}/device`;
@Injectable({
  providedIn: 'root'
})
export class InstalledappService {

  constructor(private http: HttpClient) { }

  getInstalledApps(id: any): Observable<Installedapp[]> {
    return this.http.get<Installedapp[]>(`${baseUrl}?id=${id}`)
  }
}
