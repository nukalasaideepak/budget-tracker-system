import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/export`;
  private readonly backupUrl = `${environment.apiUrl}/api/backup`;

  downloadCSV(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/csv`, {
      responseType: 'blob'
    }).pipe(
      tap(blob => this.triggerDownload(blob, 'budget_report.csv'))
    );
  }

  downloadPDF(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf`, {
      responseType: 'blob'
    }).pipe(
      tap(blob => this.triggerDownload(blob, 'budget_report.pdf'))
    );
  }

  syncToCloud(): Observable<any> {
    return this.http.post(`${this.backupUrl}/upload`, {});
  }

  diagnoseSync(): Observable<any> {
    return this.http.get(`${this.backupUrl}/diagnose`);
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
