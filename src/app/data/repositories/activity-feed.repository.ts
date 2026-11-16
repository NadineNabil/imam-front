import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IActivityFeedRepository } from '../../domain/repository-contracts/activity-feed.repository.contract';
import { ActivityEvent } from '../../domain/entities/activity-event.entity';
import { ActivityFeedService } from '../../shared/services/activity-feed.service';

@Injectable({ providedIn: 'root' })
export class ActivityFeedRepositoryImpl implements IActivityFeedRepository {
  public readonly events$: Observable<ActivityEvent>;

  constructor(private readonly service: ActivityFeedService) {
    this.events$ = this.service.events$;
  }

  connect(): Promise<void> {
    return this.service.connect();
  }

  disconnect(): void {
    this.service.disconnect();
  }

  send(message: any): void {
    this.service.send(message);
  }
}
