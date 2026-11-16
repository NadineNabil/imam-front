import { InjectionToken } from '@angular/core';
export  interface IKnowledgeSourceBusiness {
 
  CreateContentDropzoneConfigUseCase(knowledge_source_data?:any):any

  CreateQuestionSourceDropzoneConfig(onParsed: (data: any[]) => void):any

  addQuestionSource(question_source_data:any):any

  /**
   * Domain use case to load a knowledge source JSON file from its URL.
   */
  getKnowledgeSourceContent(url: string): any;

  deleteKnowledgeSource(id: number): any;

  updateQuestionSource(question_source_data:any): any;
}
export const KnowledgeSource_business_TOKEN = new InjectionToken<IKnowledgeSourceBusiness>('IKnowledgeSourceBusiness');

