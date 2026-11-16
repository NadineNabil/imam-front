import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Possible regional themes for the login background */
export type LoginRegion = 'egypt' | 'gulf' | 'europe' | 'default';

export interface RegionTheme {
  region: LoginRegion;
  /** Path or URL of the background image */
  imageUrl: string;
  /** Friendly label for accessibility */
  label: string;
}

/** Country-code sets by region */
const EGYPT_COUNTRIES   = new Set(['EG']);
const GULF_COUNTRIES    = new Set(['SA', 'AE', 'KW', 'QA', 'BH', 'OM']);
const EUROPE_COUNTRIES  = new Set([
  'FR', 'DE', 'GB', 'IT', 'ES', 'NL', 'BE', 'PT', 'SE', 'NO',
  'DK', 'CH', 'AT', 'PL', 'CZ', 'HU', 'RO', 'GR', 'FI', 'IE',
  'SK', 'HR', 'SI', 'LT', 'LV', 'EE', 'BG', 'RS', 'UA', 'BY'
]);

/** Local asset paths */
const REGION_IMAGES: Record<LoginRegion, string> = {
  egypt:   'assets/images/auth-bg-egypt.png',
  gulf:    'assets/images/auth-bg-gulf.png',
  europe:  'assets/images/auth-bg.jpg',
  default: 'assets/images/auth-bg.jpg',
};

/** Session-storage key to cache the resolved region */
const CACHE_KEY = 'moga_login_region';

@Injectable({ providedIn: 'root' })
export class GeolocationService {

  constructor(private http: HttpClient) {}

  /**
   * Resolves the regional theme for the current visitor.
   * - Uses ipinfo.io (same endpoint as LogIpAddress) to detect country.
   * - Caches the result in sessionStorage to avoid repeat calls.
   * - Falls back to 'default' on any error or unrecognised country.
   */
  getRegionTheme(): Observable<RegionTheme> {
    // Return cached result to avoid double-fetching (LogIpAddress also calls this)
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const region = cached as LoginRegion;
      return of(this.buildTheme(region));
    }

    return this.http.get<{ ip: string; country: string }>('https://ipinfo.io/json').pipe(
      map(response => {
        const country = (response?.country || '').toUpperCase();
        const region  = this.mapCountryToRegion(country);
        sessionStorage.setItem(CACHE_KEY, region);
        return this.buildTheme(region);
      }),
      catchError(() => {
        // Geolocation failure → default image, as per business rules
        sessionStorage.setItem(CACHE_KEY, 'default');
        return of(this.buildTheme('default'));
      })
    );
  }

  private mapCountryToRegion(country: string): LoginRegion {
    if (EGYPT_COUNTRIES.has(country))  return 'egypt';
    if (GULF_COUNTRIES.has(country))   return 'gulf';
    if (EUROPE_COUNTRIES.has(country)) return 'europe';
    return 'default';
  }

  private buildTheme(region: LoginRegion): RegionTheme {
    const labels: Record<LoginRegion, string> = {
      egypt:   'Egyptian landmarks',
      gulf:    'Gulf landmarks',
      europe:  'European landmarks',
      default: 'MogaEdu platform',
    };
    return {
      region,
      imageUrl: REGION_IMAGES[region],
      label: labels[region],
    };
  }
}
