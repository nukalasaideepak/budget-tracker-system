import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompareResult {
  providerName: string;
  domainName: string;
  price: number;
  currency: string;
  eta: string;
  rating: number;
  logoUrl: string;
  baseUrl: string;
  tagline: string;
  bestDeal: boolean;
  metadata: Record<string, string>;
  timestamp: string;
}

export interface PriceHistory {
  domainName: string;
  providerName: string;
  query: string;
  price: number;
  timestamp: string;
}

export interface DomainDetail {
  name: string;
  icon: string;
  color: string;
  description: string;
  providerCount: number;
  providers: string[];
}

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getDomains(): Observable<DomainDetail[]> {
    return this.http.get<DomainDetail[]>(`${this.apiUrl}/api/compare/details`);
  }

  compareFares(domainName: string, query: string, from?: string, to?: string, fromLat?: number, fromLng?: number, toLat?: number, toLng?: number): Observable<CompareResult[]> {
    const payload: any = { domainName, query };
    if (from) payload.from = from;
    if (to) payload.to = to;
    if (fromLat !== undefined) payload.fromLat = fromLat;
    if (fromLng !== undefined) payload.fromLng = fromLng;
    if (toLat !== undefined) payload.toLat = toLat;
    if (toLng !== undefined) payload.toLng = toLng;
    return this.http.post<CompareResult[]>(`${this.apiUrl}/api/compare`, payload);
  }

  getHistory(domainName: string, query: string): Observable<PriceHistory[]> {
    return this.http.get<PriceHistory[]>(`${this.apiUrl}/api/compare/history`, {
      params: { domainName, query }
    });
  }
}
