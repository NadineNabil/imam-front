import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ApiConfig } from '../config';
import { KnowledgeSource } from 'src/app/domain/entities/KnowledgeSource.entity';
import { ParseExcelFileToJson } from 'src/app/domain/business/ParseExcelFileToJson';
import { TranslateService } from '@ngx-translate/core';
import { AuthStateService } from 'src/app/shared/services/auth-state.service';
import { GetValidAccessTokenUseCase } from 'src/app/domain/business/GetValidAccessToken.business';

@Injectable({ providedIn: 'root' })
export class KnowledgeSourceApiService  {
 
  
    constructor(private http: HttpClient,
       private readonly apiConfig: ApiConfig,
      private readonly  authState: AuthStateService,
          private readonly translate: TranslateService,
        private getValidToken: GetValidAccessTokenUseCase) {
            
          }

     CreateQuestionDropzoneConfig(onParsed: (data: any[]) => void)
    {
      const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
   
      const parser = new ParseExcelFileToJson();

        return {
            url: "/",
            autoProcessQueue: false,
            maxFiles: 1,
            acceptedFiles: '.xlsx',
            addRemoveLinks: true,
             dictRemoveFile: '✖',
             headers: {
                'Accept-Language': lang
              },
             init(this: any) {
             this.on('addedfile', async (file: File) => {
              const data = await parser.execute(file);
               onParsed(data); // ✅ expose JSON
            });
            }

          };
        
    }

    CreateContentDropzoneConfig(params?:KnowledgeSource)
    {
      const lang = this.translate.currentLang ?? this.translate.defaultLang ?? 'en';
      const tokenService = this.getValidToken;
      let accessToken = '';

      const ensureAccessToken = async () => {
        accessToken = await firstValueFrom(tokenService.execute()) ?? '';
        return accessToken;
      };

      return {
        url: this.apiConfig.getUrl(this.apiConfig.endpoints.lessons.addKnowledgeSource),
        autoProcessQueue: false,
        maxFiles: 1,
        acceptedFiles: '.pdf,.doc,.docx,.mp4,.pptx,.ppt',
        headers: {
          'Accept-Language': lang
        },
        init(this: any) {
          const dz = this as any;

          if (typeof this.on === 'function') {
            this.on('addedfile', async (file: any) => {
              await ensureAccessToken();
              dz.processQueue();
            });

            this.on('sending', (file: any, xhr: any, formData: FormData) => {
              if (accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
              }

              const meta = file.meta;
              formData.append('name', meta.name);
              formData.append('description', meta.description);
              formData.append('learning_unit_id', meta.learning_unit_id);
              formData.append('lang', meta.lang);
              formData.append('knowledge_source_type', meta.knowledge_source_type);
              formData.append('knowledge_type', meta.knowledge_type);
              formData.append('time_stamp', new Date().toISOString());
            });

            this.on('error', async (file: any, message: any, xhr: any) => {
              if (xhr?.status !== 401) {
                return;
              }

              if (file._retried) {
                return;
              }

              file._retried = true;
              await ensureAccessToken();
              dz.processQueue();
            });
          }
        }
      };
    }
    

  addQuestionSource(question_source_data:any) {
       const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });

    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.lessons.addKnowledgeSource);
    return this.http.post(url, question_source_data, { headers });
  }
   
  
  getKnowledgeSourceContent(url: string): Observable<any> {
    // const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
    //   const headers = new HttpHeaders({ 'Accept-Language': lang });

    // const fullUrl =`${this.apiConfig.fileUrl}/${url}`;
   const params = new HttpParams().set('path', url);

  return this.http.get(`${this.apiConfig.fileUrl}/knowledgeSource/knowledge-source-file`, {
    params
  });
  }

  deleteKnowledgeSource(id: number): Observable<any> {
     const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });

    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.lessons.deleteKnowledgeSource(id));
    return this.http.delete<any>(url, { headers });
  }


  updateKnowledgeSource(question_source_data:any): Observable<any> {
     const lang =  this.translate.currentLang ??this.translate.defaultLang ??'en';
     
      const headers = new HttpHeaders({ 'Accept-Language': lang });

      
    const url = this.apiConfig.getUrl(this.apiConfig.endpoints.lessons.updateKnowledgeSource);
    return this.http.put<any>(url, question_source_data, { headers });
  } 

}
 

