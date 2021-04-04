import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/security/auth.service';
import { UserModel } from 'src/app/auth/security/user/user.model';
import { ArteModel } from 'src/app/model/arte.model';
import { CollectionModel } from 'src/app/model/collection.model';
import { VoteModel } from 'src/app/model/vote.model';
import { ArteService } from '../services/arte.service';
import { CollectionService } from '../services/collection.service';

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {

  user: UserModel;
  collection = new CollectionModel();

  constructor(
    @Inject(MAT_DIALOG_DATA) public art: ArteModel,
    private service: ArteService,
    private colService: CollectionService,
    private readonly snackBar: MatSnackBar,
    private db: AngularFirestore,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(usr => {
      this.user = usr;
    });
  }

  vote(): void {
    const voteTemp: VoteModel = {
      uid: this.user.uid,
      data: new Date(),
      artId: this.art._id,
      collectionId: this.collection._id,
    };

    const docRef = this.db.collection(`votes`).doc(this.user.uid);

    docRef.get().subscribe(doc => {
      if (doc.exists) {
        this.snackBar.open(
          `Você já votou neste design!! 😔`,
          'OK!',
          {
            duration: 4000,
          },
        );
      } else {
        console.log('No such document!');
        this.voteOK(this.art._id);
        docRef.set(voteTemp, { merge: true }).then(() => {
          this.snackBar.open(
            `Voto contabilizado com sucesso! 😀`,
            'Valeu!',
            {
              duration: 4000,
            },
          );
        }).catch(error => {
          this.snackBar.open(
            `Erro ao votar! ${error.message} 😔`,
            'OK!',
            {
              duration: 4000,
            },
          );
        });
      }
    }, error => {
      console.log('Error getting document:', error);
    });
  }

  voteOK(id: string): void {
    this.service.getVote(id).subscribe(response => {
      }, error => {
      this.snackBar.open(
        `Ocorreu um erro! 🥵`,
        'Eita!',
        {
          duration: 4000,
        },
      );
    });
  }

}
