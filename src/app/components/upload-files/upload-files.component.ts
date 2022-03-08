import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TemplateService } from 'src/app/lib/services';
import { IEntityEditAudit } from 'src/app/lib';

@Component({
  selector: 'qddt-upload-files',
  templateUrl: './upload-files.component.html',

})
export class UploadFilesComponent implements OnInit {
  @Input() entity: IEntityEditAudit;
  @Output() entityChanged = new EventEmitter<IEntityEditAudit>();

  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  message = '';

  fileInfos: Observable<any>;

  constructor(private uploadService: TemplateService) { }

  ngOnInit(): void {
    // this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.entity.id, this.currentFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          let progress = Math.round(100 * event.loaded / event.total).toString();
          console.debug(progress)
          if (this.currentFile)
            document.getElementById("loader").style.width = progress
          // } else if (event.type === HttpEventType.Response) {

        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          if (event.status === 200)
            this.entityChanged.emit(event.body)
          console.debug(event)
        } else {
          console.debug(event)
          this.currentFile = null
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });

    this.selectedFiles = undefined;
  }

}
