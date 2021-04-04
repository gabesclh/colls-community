import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { auth, User } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserModel } from './user/user.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirebaseApp } from '@angular/fire';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: UserModel;
  user: Observable<UserModel>;

  uid: string;

  headers = new HttpHeaders().append('accept', 'application/json').append('content-type', 'application/json');

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private readonly snackBar: MatSnackBar,
    private http: HttpClient,
    private firebase: FirebaseApp
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<UserModel>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async loginViaGoogle(): Promise<any> {
    const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${credential.user.uid}`);
    this.uid = credential.user.uid;
    this.updateUserData(credential.user);
    this.firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
      this.setAuthToken(idToken);
    }).catch(error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });

    if (!credential.user.providerData.find(x => x.providerId === 'password')) {
      console.log('usuário não tem provider password.');
      return this.router.navigate(['/signup'], { queryParams: { completeSignUp: 'true' } });
    } else {
      return this.router.navigate(['/']);
    }
  }

  async loginViaPassword(email: string, password: string): Promise<any> {
    const credential = await this.afAuth.signInWithEmailAndPassword(email, password);
    this.firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
      this.setAuthToken(idToken);
    }).catch(error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
    this.uid = credential.user.uid;
    return this.updateUserData(credential.user);
  }

  async registerViaPassword(email: string, password: string): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    this.firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
      this.setAuthToken(idToken);
    }).catch(error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
    this.uid = credential.user.uid;
    return this.updateUserData(credential.user);
  }

  async logout(): Promise<any> {
    await this.afAuth.signOut();
    localStorage.removeItem('tkn');
    return this.router.navigate(['/login']);
  }

  hasEmailSignIn(email: string): void {
    const signIns = this.afAuth.fetchSignInMethodsForEmail(email);
    console.log(signIns);
  }

  updateUserData(user: UserModel): Promise<any> {
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${user.uid}`);
    let data: UserModel;
    if (user.cpf && user.phoneNumber) {
      data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        cpf: user.cpf,
        phoneNumber: user.phoneNumber,
        userDesigner: user.userDesigner,
        userAdmin: user.userAdmin,
      };
    } else {
      data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    }
    return userRef.set(data, { merge: true });
  }

  resetPassword(email: string): void {
    this.afAuth.sendPasswordResetEmail(email).then(response => {
      this.snackBar.open(
        `Te enviamos um e-mail de reset de senha! 😀`,
        'Valeu!',
        {
          duration: 4000,
        },
      );
    }).catch(error => {
      this.snackBar.open(`${error.message} 😢`, 'Fechar', {
        duration: 4000,
      });
    });
  }

  setAuthToken(token): void {
    localStorage.setItem('tkn', token);
  }

  getAuthToken(): any {
    return this.afAuth.currentUser.then(user => {
      return user.getIdToken().then(token => {
        localStorage.setItem('tkn', token);
        return token;
      });
    });
  }

  refreshToken(): any {
    this.firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(idToken => {
      this.setAuthToken(idToken);
    }).catch(error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('tkn')) {
      return true;
    } else {
      return false;
    }
  }

}
