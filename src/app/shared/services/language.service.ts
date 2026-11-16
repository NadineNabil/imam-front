import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  public languages: string[] = ['en', 'ar'];
  private renderer: Renderer2;
  private selectedLang: string;
  constructor(
    public translate: TranslateService, 
    private cookieService: CookieService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    let browserLang: any;
    /**
     * cookie Language Get
    */
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      browserLang = translate.getBrowserLang();
    }
    this.selectedLang = browserLang.match(/en|ar/) ? browserLang : 'en';
    this.translate.use(this.selectedLang);
    this.setDirection(this.selectedLang);
  }
  /**
   * Cookie Language get
   */
  public getLanguage() {
    return this.selectedLang
  }

  /**
   * Cookie Language set
   */

  public setLanguage(lang: any) {
    this.selectedLang = lang;
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
    this.translate.use(lang);
    this.setDirection(lang);
  }

  /**
   * Set direction based on language
   */
  private setDirection(lang: string) {
    const htmlElement = this.document.documentElement;
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(htmlElement, 'dir', direction);
    this.renderer.setAttribute(htmlElement, 'lang', lang);
  }
}

