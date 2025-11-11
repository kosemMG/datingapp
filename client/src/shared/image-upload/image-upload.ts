import { Component, input, output, signal } from '@angular/core';

type FileReaderResult = string | ArrayBuffer | null | undefined;

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html'
})
export class ImageUpload {
  public readonly upload = output<File>();
  public readonly loading = input<boolean>(false);
  protected readonly imageSrc = signal<FileReaderResult>(null);
  protected isDragging = false;
  private file: File | null = null;

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (!event.dataTransfer?.files.length) return;

    const file = event.dataTransfer.files[0];
    this.previewFile(file);
    this.file = file;
  }

  protected uploadFile(): void {
    if (!this.file) return;
    this.upload.emit(this.file);
  }

  protected cancel(): void {
    this.file = null;
    this.imageSrc.set(null);
  }

  private previewFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => this.imageSrc.set(event?.target?.result);
    reader.readAsDataURL(file);
  }
}
