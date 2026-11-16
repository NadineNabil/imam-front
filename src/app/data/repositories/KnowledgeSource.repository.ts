import { Injectable } from '@angular/core';
import { IKnowledgeSourceRepository } from 'src/app/domain/repository-contracts/KnowledgeSource-repository.contract';
import { KnowledgeSourceApiService } from '../api/KnowledgeSource-api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class KnowledgeSourceRepositoryImpl implements IKnowledgeSourceRepository {
  
    constructor(private readonly KnowledgeSourceApi: KnowledgeSourceApiService) {}
  
    getKnowledgeSourceContent(url: string): Observable<any> {
      return this.KnowledgeSourceApi.getKnowledgeSourceContent(url);
      
   }

    deleteKnowledgeSource(id: number): Observable<any> {
      return this.KnowledgeSourceApi.deleteKnowledgeSource(id);
    }
   
    addQuestionSource(question_source_data: any) {
      return this.KnowledgeSourceApi.addQuestionSource(question_source_data);
   }
   
   updateQuestionSource(question_source_data: any) {
      return this.KnowledgeSourceApi.updateKnowledgeSource(question_source_data);
   }
   
    CreateQuestionSourceDropzoneConfig(onParsed: (data: any[]) => void) {
       return this.KnowledgeSourceApi.CreateQuestionDropzoneConfig(onParsed);

    }

    CreateContentDropzoneConfig(knowledge_source_data?:any)
    {
       return this.KnowledgeSourceApi.CreateContentDropzoneConfig(knowledge_source_data);
    }

    

}           