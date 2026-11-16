import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Third-party imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule, NgbTooltipModule, NgbPopoverModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { provideStore, StoreModule } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { NgxEchartsModule } from 'ngx-echarts';

// App modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// === CLEAN ARCHITECTURE MODULES ===
import { DomainModule } from './domain/domain.module';
import { DataModule } from './data/data.module';

// Presentation modules
import { LayoutsModule } from './presentation/layouts/layouts.module';
import { PagesModule } from './presentation/pages/pages.module';

// Shared module
import { SharedModule } from './shared/shared.module';

// Extrapages
import { ExtrapagesModule } from './presentation/pages/extrapages/extrapages.module';

// Store from presentation layer
import { rootReducer } from './presentation/store';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader();
}

/**
 * App Module - Clean Architecture Version
 * 
 * ARCHITECTURE LAYERS:
 * ├── domain/        → Domain entities, repository contracts, business logic, business contracts
 * ├── data/          → Repository implementations, API services, DTOs, interceptors, state
 * ├── presentation/  → Layouts, Pages, Store (UI state), Guards
 * └── shared/        → Reusable UI components, Services
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,

    // Routing
    AppRoutingModule,

    // === CLEAN ARCHITECTURE MODULES ===
    DomainModule,
    DataModule,

    // Presentation layer
    LayoutsModule,
    PagesModule,
    
    // Extrapages (404, 500, maintenance, coming-soon)
    ExtrapagesModule,
    
    // Shared
    SharedModule,

    // NgRx Store
    StoreModule.forRoot({}, {}),

    // Third-party
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgbModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbNavModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CookieService,
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(rootReducer),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: 'assets/i18n/',
        suffix: '.json'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
