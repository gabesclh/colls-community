import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: Observable<User>;
  user: UserModel;
  userRef: AngularFirestoreDocument<UserModel>;
  userForm: FormGroup;
  showForm = false;
  hide = true;
  step = 0;

  constructor(
    private readonly snackBar: MatSnackBar,
    public auth: AuthService,
    private afs: AngularFirestore,
  ) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(usr => {
      this.user = usr;
      this.userForm = new FormGroup({
        email: new FormControl({ value: this.user.email, disabled: true }, [Validators.required, Validators.email]),
        displayName: new FormControl({ value: this.user.displayName, disabled: true }, [Validators.required]),
        cpf: new FormControl({ value: this.user.cpf, disabled: true }, [Validators.required]),
        phoneNumber: new FormControl({ value: this.user.phoneNumber, disabled: true }, [Validators.required]),
        address: new FormControl({ value: (this.user.address ? this.user.address.address : ''), disabled: true }, [Validators.required]),
        complement: new FormControl({ value: (this.user.address ? this.user.address.complement : ''), disabled: true }, [Validators.required]),
        city: new FormControl({ value: (this.user.address ? this.user.address.city : ''), disabled: true }, [Validators.required]),
        state: new FormControl({ value: (this.user.address ? this.user.address.state : ''), disabled: true }, [Validators.required]),
        country: new FormControl({ value: (this.user.address ? this.user.address.country : ''), disabled: true }, [Validators.required]),
        postalCode: new FormControl({ value: (this.user.address ? this.user.address.postalCode : ''), disabled: true }, [Validators.required]),
        code: new FormControl({ value: (this.user.bank ? this.user.bank.code : ''), disabled: true }, [Validators.required]),
        agency: new FormControl({ value: (this.user.bank ? this.user.bank.agency : ''), disabled: true }, [Validators.required]),
        account: new FormControl({ value: (this.user.bank ? this.user.bank.account : ''), disabled: true }, [Validators.required]),
      });
    });
  }

  toggleEdit(): void {
    this.showForm = true;
    this.setStep(1);
    this.userForm.get('email').enable();
    this.userForm.get('displayName').enable();
    this.userForm.get('cpf').enable();
    this.userForm.get('phoneNumber').enable();
    this.userForm.get('address').enable();
    this.userForm.get('complement').enable();
    this.userForm.get('city').enable();
    this.userForm.get('state').enable();
    this.userForm.get('country').enable();
    this.userForm.get('postalCode').enable();
    this.userForm.get('code').enable();
    this.userForm.get('agency').enable();
    this.userForm.get('account').enable();
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  submitEdit(): void {
    const userTemp: any = {};
    userTemp.email = this.userForm.get('email').value;
    userTemp.displayName = this.userForm.get('displayName').value;
    userTemp.cpf = this.userForm.get('cpf').value;
    userTemp.phoneNumber = this.userForm.get('phoneNumber').value;
    userTemp.address = {};
    userTemp.address.address = this.userForm.get('address').value;
    userTemp.address.complement = this.userForm.get('complement').value;
    userTemp.address.city = this.userForm.get('city').value;
    userTemp.address.state = this.userForm.get('state').value;
    userTemp.address.country = this.userForm.get('country').value;
    userTemp.address.postalCode = this.userForm.get('postalCode').value;
    userTemp.bank = {};
    userTemp.bank.code = this.userForm.get('code').value;
    userTemp.bank.agency = this.userForm.get('agency').value;
    userTemp.bank.account = this.userForm.get('account').value;

    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.user.uid}`);
    userRef.set(userTemp, { merge: true }).then(() => {
      this.snackBar.open(
        `Perfil atualizado com sucesso! 😀`,
        'Valeu!',
        {
          duration: 4000,
        },
      );
      this.showForm = false;
      this.setStep(0);
    }).catch(error => {
      this.snackBar.open(
        `Erro ao atualizar seu perfil! ${error.message} 😔`,
        'OK!',
        {
          duration: 4000,
        },
      );
    });

  }

  // updateUserData(user: UserModel): Promise<any> {
  //   let data: UserModel;
  //   return this.userRef.set(data, { merge: true });
  // }

}
