import { Component, OnInit } from '@angular/core';
@Component({ selector: 'app-lockscreen', templateUrl: './lockscreen.component.html', styleUrls: ['./lockscreen.component.scss'], standalone: false })
export class LockscreenComponent implements OnInit { year = new Date().getFullYear(); ngOnInit(): void { document.body.setAttribute('data-layout', 'vertical'); } }

