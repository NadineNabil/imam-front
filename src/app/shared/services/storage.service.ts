import { Injectable } from '@angular/core';

/**
 * Storage Service
 * 
 * Abstraction over localStorage/sessionStorage.
 * Makes testing easier and provides type safety.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly local: Storage;
  private readonly session: Storage;

  constructor() {
    this.local = localStorage;
    this.session = sessionStorage;
  }

  /**
   * Get item from LOCAL storage (persistent)
   */
  getLocal<T>(key: string): T | null {
    try {
      const item = this.local.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set item in LOCAL storage (persistent)
   */
  setLocal<T>(key: string, value: T): void {
    try {
      this.local.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error (local):', error);
    }
  }

  /**
   * Get item from SESSION storage (cleared when browser/tab is closed)
   */
  getSession<T>(key: string): T | null {
    try {
      const item = this.session.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set item in SESSION storage (cleared when browser/tab is closed)
   */
  setSession<T>(key: string, value: T): void {
    try {
      this.session.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error (session):', error);
    }
  }

  /**
   * Remove item from both local and session storage
   */
  remove(key: string): void {
    this.local.removeItem(key);
    this.session.removeItem(key);
  }

  /**
   * Clear all storage (local and session)
   */
  clear(): void {
    this.local.clear();
    this.session.clear();
  }

  /**
   * Check if key exists in either storage
   */
  has(key: string): boolean {
    return this.local.getItem(key) !== null || this.session.getItem(key) !== null;
  }

  /**
   * Backwards-compatible generic getters/setters using LOCAL storage by default
   * (keeps existing callers working as before).
   */
  get<T>(key: string): T | null {
    return this.getLocal<T>(key);
  }

  set<T>(key: string, value: T): void {
    this.setLocal<T>(key, value);
  }
}

