import { Inject, Injectable } from '@angular/core';
import { IKnowledgeSourceRepository, KnowledgeSource_REPOSITORY_TOKEN } from '../repository-contracts/KnowledgeSource-repository.contract';
import { IKnowledgeSourceBusiness } from '../business-contracts/KnowledgeSource.business.contract';
import { Observable } from 'rxjs';
import { KnowledgeSource } from '../entities/KnowledgeSource.entity';


@Injectable({ providedIn: 'root' })
export class KnowledgeSourceBusiness implements IKnowledgeSourceBusiness {

    constructor(
    @Inject(KnowledgeSource_REPOSITORY_TOKEN) private readonly KnowledgeSourceRepo: IKnowledgeSourceRepository
  ) {}

  getKnowledgeSourceContent(url: string) {
   return this.KnowledgeSourceRepo.getKnowledgeSourceContent(url);
  }

  deleteKnowledgeSource(id: number) {
    return this.KnowledgeSourceRepo.deleteKnowledgeSource(id);
  }
  
  addQuestionSource(question_source_data: any) {
    return this.KnowledgeSourceRepo.addQuestionSource(question_source_data);
  }
  
  CreateQuestionSourceDropzoneConfig(onParsed: (data: any[]) => void) {
    return this.KnowledgeSourceRepo.CreateQuestionSourceDropzoneConfig(onParsed);
  }

  CreateContentDropzoneConfigUseCase()
  {
    return this.KnowledgeSourceRepo.CreateContentDropzoneConfig()

  }

  updateQuestionSource(question_source_data: any) {
    return this.KnowledgeSourceRepo.updateQuestionSource(question_source_data);
  }
}

