import { Component, OnInit } from '@angular/core';
@Component({ selector: 'app-verification', templateUrl: './verification.component.html', styleUrls: ['./verification.component.scss'], standalone: false })
export class VerificationComponent implements OnInit { year = new Date().getFullYear(); ngOnInit(): void {} }

