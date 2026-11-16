import { Component, OnInit } from '@angular/core';
import { App_build_date, APP_VERSION } from 'src/environments/version';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})

/**
 * Footer Component
 */
export class FooterComponent implements OnInit {
  app_version = APP_VERSION;
  app_build_date = App_build_date;
  // app_build_version = App_build_Version;
   // set the currenr year
   year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}

