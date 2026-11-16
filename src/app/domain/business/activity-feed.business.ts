import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IActivityFeedBusiness } from '../business-contracts/activity-feed.business.contract';
import {
  IActivityFeedRepository,
  ACTIVITY_FEED_REPOSITORY_TOKEN
} from '../repository-contracts/activity-feed.repository.contract';
import { ActivityEvent } from '../entities/activity-event.entity';

@Injectable({ providedIn: 'root' })
export class ActivityFeedBusiness implements IActivityFeedBusiness {
  public readonly events$: Observable<ActivityEvent>;

  constructor(
    @Inject(ACTIVITY_FEED_REPOSITORY_TOKEN)
    private readonly repository: IActivityFeedRepository
  ) {
    this.events$ = this.repository.events$;
  }

  connect(): Promise<void> {
    return this.repository.connect();
  }

  disconnect(): void {
    this.repository.disconnect();
  }

  send(message: any): void {
    this.repository.send(message);
  }
}
