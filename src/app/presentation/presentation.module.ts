import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsModule } from './layouts/layouts.module';

/**
 * Presentation Module
 * 
 * Groups all presentation layer modules together.
 * This module can be imported in AppModule.
 */
@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  exports: [
    LayoutsModule
  ]
})
export class PresentationModule {}

