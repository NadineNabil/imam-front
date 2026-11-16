import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityEvent } from '../entities/activity-event.entity';

export interface IActivityFeedRepository {
  events$: Observable<ActivityEvent>;
  connect(): Promise<void>;
  disconnect(): void;
  send(message: any): void;
}

export const ACTIVITY_FEED_REPOSITORY_TOKEN = new InjectionToken<IActivityFeedRepository>(
  'IActivityFeedRepository'
);
