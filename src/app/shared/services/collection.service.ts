import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';
import { CollectionModel } from 'src/app/model/collection.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  user = new UserModel();
  headers = new HttpHeaders().append('accept', 'application/json').append('content-type', 'application/json');

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  getCurrentCollection(): Observable<any> {
    return this.http.get(environment.apiUrl + 'collection/getAtual', { headers: this.headers });
  }


}
