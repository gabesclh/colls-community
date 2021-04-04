import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';
import { ArteModel } from 'src/app/model/arte.model';
import { CollectionModel } from 'src/app/model/collection.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArteService {

  user = new UserModel();

  headers = new HttpHeaders().append('accept', 'application/json').append('content-type', 'application/json');

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  getArtsByUid(uid: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'art/getAll/' + this.user.uid, { headers: this.headers });
  }

  postArt(arte: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'art/new', arte, { headers: this.headers });
  }

  upadteArt(arte: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'art/update', arte, { headers: this.headers });
  }

  getArts(): Observable<any> {
    return this.http.get(environment.apiUrl + 'art/getAll', { headers: this.headers });
  }

  getArtsByTopVotes(): Observable<any> {
    return this.http.get(environment.apiUrl + 'art/getAllCollectionTop', { headers: this.headers });
  }

  getVote(id: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'art/voteAdd/' + id, { headers: this.headers });
  }

  getRemove(id: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'art/remove/' + id, { headers: this.headers });
  }

}
