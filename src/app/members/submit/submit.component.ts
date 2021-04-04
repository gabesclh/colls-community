import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ArteModel } from 'src/app/model/arte.model';
import { CollectionModel } from 'src/app/model/collection.model';
import { ArteService } from 'src/app/shared/services/arte.service';
import { CollectionService } from 'src/app/shared/services/collection.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

  step = 1;
  currentValidStep = 0;
  artForm: FormGroup;
  isHovering: boolean;
  submitOk = false;
  file: File;
  arte = new ArteModel();
  collection = new CollectionModel();

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  user: User;
  showDetails = false;

  constructor(
    private artService: ArteService,
    private colService: CollectionService,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private fAuth: AngularFireAuth,
    private readonly snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fAuth.user.subscribe(user => {
      this.user = user;
    });
    this.getCurrentCollection();
    this.artForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      collection: new FormControl(this.collection._id, [Validators.required]),
    });
  }

  getCurrentCollection(): void {
    this.colService.getCurrentCollection().subscribe(response => {
      this.collection = response.body;
      this.artForm.get('collection').setValue(this.collection._id);
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

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    // for (let i = 0; i < files.length; i++) {
    //   this.files.push(files.item(i));
    // }
    // this.uploadFile(files.item(0));
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

  submit(): void {
    this.arte.arteImg = this.downloadURL;
    this.arte.contVotos = 0;
    this.arte.data = new Date();
    this.arte.descricao = this.artForm.get('description').value;
    this.arte.titulo = this.artForm.get('title').value;
    this.arte.idColecao = this.artForm.get('collection').value;
    this.arte.uidAutor = this.user.uid;
    this.arte.status = true;

    this.artService.postArt(this.arte).subscribe(response => {
      this.submitOk = true;
      this.snackBar.open(
        `Design submetido com sucesso! 😃`,
        'Uhu!',
        {
          duration: 4000,
        },
      );
    }, error => {
      this.snackBar.open(
        `Erro ao submeter o design! 😔`,
        'OK!',
        {
          duration: 4000,
        },
      );
    });
  }

  uploadFile(files: FileList): void {

    this.file = files.item(0);
    // The storage path
    const path = `files/${this.user.email}/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db.collection('files').add({
          downloadURL: this.downloadURL,
          path,
          uid: this.user.uid,
        });
        this.showDetails = true;
      }),
    );
  }

}
