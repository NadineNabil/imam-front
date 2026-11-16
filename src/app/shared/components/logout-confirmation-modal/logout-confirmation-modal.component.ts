import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-logout-confirmation-modal',
    templateUrl: './logout-confirmation-modal.component.html',
    styleUrls: ['./logout-confirmation-modal.component.scss'],
    standalone: false
})
export class LogoutConfirmationModalComponent implements OnInit {

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void {
    }

    confirm() {
        this.activeModal.close('confirm');
    }

    dismiss() {
        this.activeModal.dismiss();
    }

}
