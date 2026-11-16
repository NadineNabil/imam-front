import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {
  private activeComponent: CanComponentDeactivate | null = null;

  registerComponent(component: CanComponentDeactivate): void {
    this.activeComponent = component;
  }

  unregisterComponent(component: CanComponentDeactivate): void {
    if (this.activeComponent === component) {
      this.activeComponent = null;
    }
  }

  canDeactivate(): Observable<boolean> {
    if (this.activeComponent && typeof this.activeComponent.canDeactivate === 'function') {
      const result = this.activeComponent.canDeactivate();
      if (result instanceof Observable) {
        return result;
      }
      if (result instanceof Promise) {
        return from(result);
      }
      return of(result);
    }
    return of(true);
  }
}
