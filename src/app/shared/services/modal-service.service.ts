import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {

  private modals: Map<string, any> = new Map();
  private opened: Set<string> = new Set();

  register(id: string, instance: any) {
     if (this.modals.has(id)) return; // prevent overwrite
    this.modals.set(id, instance);
  }

open(id: string) {
  const modal = this.modals.get(id);
  if (!modal) return;

  const el = modal._element;

  if (!el) return;

  // ✅ prevent duplicate instance (Bootstrap native)
  const instance =
    (window as any).bootstrap.Modal.getInstance(el)
    || modal;

  instance.show();

  // ❌ remove opened Set completely
}

  close(id: string) {
    const modal = this.modals.get(id);

    if (!modal) return;

    modal.hide();
    this.opened.delete(id);
  }

  isOpen(id: string): boolean {
    return this.opened.has(id);
  }
}