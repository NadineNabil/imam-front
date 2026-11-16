import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { KnowledgeSource } from '../entities/KnowledgeSource.entity';


export interface IKnowledgeSourceRepository {

  CreateContentDropzoneConfig():any;
  CreateQuestionSourceDropzoneConfig(onParsed: (data: any[]) => void):any

  addQuestionSource(question_source_data:any):any

  /**
   * Load and parse a knowledge source JSON file from backend storage.
   * The URL is the relative or absolute path returned in `lesson.knowledge_sources[*].url`.
   */
  getKnowledgeSourceContent(url: string): Observable<any>;

  deleteKnowledgeSource(id: number): Observable<any>;

  updateQuestionSource(question_source_data:any): Observable<any>;
  }

/**
 * Injection token for User Repository
 * Used for Angular dependency injection since interfaces don't exist at runtime
 */
export const KnowledgeSource_REPOSITORY_TOKEN = new InjectionToken<IKnowledgeSourceRepository>('IKnowledgeSourceRepository');

