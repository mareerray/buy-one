import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  maxImageSize = 2 * 1024 * 1024;
  allowedProductImageTypes = ['image/jpeg', 'image/png'];
  allowedAvatarTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Mock upload for avatar image
  uploadAvatar(file: File): Observable<HttpEvent<any>> {
    if (!this.allowedAvatarTypes.includes(file.type)) {
      return throwError(() => new Error('Invalid avatar file type'));
    }
    if (file.size > this.maxImageSize) {
      return throwError(() => new Error('Avatar file size must be less than 2MB'));
    }
    return this.mockUpload(file);
  }

  // Mock upload for product images (could be multiple)
  uploadProductImage(
    file: File,
    previewList: { file: File; dataUrl: string }[],
  ): Observable<HttpEvent<any>> {
    if (!this.allowedProductImageTypes.includes(file.type)) {
      return throwError(() => new Error('Invalid product image file type'));
    }
    if (file.size > this.maxImageSize) {
      return throwError(() => new Error('Product image file size must be less than 2MB'));
    }
    if (this.isAlreadySelected(file, previewList)) {
      return throwError(() => new Error('This image has already been selected.'));
    }
    return this.mockUpload(file);
  }

  isAlreadySelected(file: File, previewList: { file: File | null; dataUrl: string }[]): boolean {
    return previewList.some(
      (img) =>
        img.file !== null &&
        img.file !== undefined &&
        img.file.name === file.name &&
        img.file.size === file.size,
    );
  }

  // Mock upload method simulating progress and completion
  private mockUpload(file: File): Observable<HttpEvent<any>> {
    const progress$ = new Subject<HttpEvent<any>>();
    let progress = 0;

    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        progress$.next(new HttpResponse({ body: { url: 'mock-url/' + file.name }, status: 200 }));
        progress$.complete();
        clearInterval(interval);
      } else {
        progress$.next({ type: HttpEventType.UploadProgress, loaded: progress, total: 100 });
      }
    }, 500);

    return progress$.asObservable();
  }

  deleteImage(id: string): Observable<void> {
    // Simulate delete success
    return of(void 0);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class MediaService {
//   private baseUrl = '/media/images'; // your backend media API base endpoint

//   constructor(private http: HttpClient) {}

//   uploadImage(file: File): Observable<HttpEvent<any>> {
//     const formData = new FormData();
//     formData.append('file', file);
//     const req = new HttpRequest('POST', this.baseUrl, formData, {
//       reportProgress: true // for progress bar
//     });
//     return this.http.request(req);
//   }

//   deleteImage(id: string): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/${id}`);
//   }
// }
