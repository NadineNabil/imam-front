import { Component, OnInit } from '@angular/core';
@Component({ selector: 'app-confirmmail', templateUrl: './confirmmail.component.html', styleUrls: ['./confirmmail.component.scss'], standalone: false })
export class ConfirmmailComponent implements OnInit { year = new Date().getFullYear(); ngOnInit(): void {} }

