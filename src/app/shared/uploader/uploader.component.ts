import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  user: User;
  showDetails = false;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;
      this.startUpload();
    });
  }

  startUpload(): void {

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

  isActive(snapshot): any {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
