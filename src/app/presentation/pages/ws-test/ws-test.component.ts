import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  IActivityFeedBusiness,
  ACTIVITY_FEED_BUSINESS_TOKEN
} from '../../../domain/business-contracts/activity-feed.business.contract';
import { ActivityEvent } from '../../../domain/entities/activity-event.entity';
import { environment } from '../../../../environments/environment';

interface LogEntry {
  timestamp: Date;
  event: ActivityEvent;
}

@Component({
  selector: 'app-ws-test',
  templateUrl: './ws-test.component.html',
  styleUrls: ['./ws-test.component.scss'],
  standalone: false,
})
export class WsTestComponent implements OnInit, OnDestroy {
  /** Shown in the UI so the tester knows which server they're hitting. */
  readonly wsUrl = `${environment.wsBaseUrl}/ws/activity-feed`;

  // ── State ──────────────────────────────────────────────────────────────────
  isConnected = false;
  log: LogEntry[] = [];

  private sub?: Subscription;

  constructor(
    @Inject(ACTIVITY_FEED_BUSINESS_TOKEN)
    private readonly activityFeedBusiness: IActivityFeedBusiness
  ) {}

  ngOnInit(): void {
    // Subscribe once; start/stop socket via business layer
    this.sub = this.activityFeedBusiness.events$.subscribe((event) => {
      this.isConnected = true;
      this.log.unshift({ timestamp: new Date(), event });
      if (this.log.length > 100) this.log.pop();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.activityFeedBusiness.disconnect();
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  connect(): void {
    this.activityFeedBusiness.connect();
    this.isConnected = true;
  }

  disconnect(): void {
    this.activityFeedBusiness.disconnect();
    this.isConnected = false;
  }

  clearLog(): void {
    this.log = [];
  }

  sendPing(): void {
    this.activityFeedBusiness.send({
      type: 'ping',
      message: 'Hello WebSocket server!',
      timestamp: new Date().toISOString()
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  formatEvent(event: ActivityEvent): string {
    return JSON.stringify(event, null, 2);
  }

  badgeClass(type: string): string {
    const map: Record<string, string> = {
      login: 'badge-success',
      logout: 'badge-secondary',
      error: 'badge-danger',
      warning: 'badge-warning',
      info: 'badge-info',
    };
    return map[type?.toLowerCase()] ?? 'badge-primary';
  }
}
