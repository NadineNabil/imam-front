import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityEvent } from '../entities/activity-event.entity';

export interface IActivityFeedBusiness {
  events$: Observable<ActivityEvent>;
  connect(): Promise<void>;
  disconnect(): void;
  send(message: any): void;
}

export const ACTIVITY_FEED_BUSINESS_TOKEN = new InjectionToken<IActivityFeedBusiness>(
  'IActivityFeedBusiness'
);
