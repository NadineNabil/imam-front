import { Injectable } from '@angular/core';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthStateService } from './auth-state.service';
import { GetValidAccessTokenUseCase } from 'src/app/domain/business/GetValidAccessToken.business';


/**
 * Shape of every message that comes from the Python WebSocket server.
 * `type` is always present; every other field depends on the event.
 */
export interface ActivityEvent {
  type: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  private socket: WebSocket | null = null;
  private eventsSubject = new Subject<ActivityEvent>();

  // Reconnect state
  private reconnectAttempts = 0;
  private readonly maxReconnectDelay = 30_000; // 30 s cap
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isManualDisconnect = false;

  /** Subscribe to this to receive live events. */
  public events$: Observable<ActivityEvent> = this.eventsSubject.asObservable();

  constructor(
    private readonly authState: AuthStateService,
    private readonly getValidToken: GetValidAccessTokenUseCase
  ) { }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Opens the WebSocket connection.
   * Automatically validates/refreshes the access token before connecting.
   */
  async connect(): Promise<void> {
    this.isManualDisconnect = false;

    // Prevent duplicate connections
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn('ActivityFeedService: already connected or connecting – skipping.');
      return;
    }

    let token = '';
    try {
      token = (await firstValueFrom(this.getValidToken.execute())) ?? '';
    } catch (err) {
      console.warn('ActivityFeedService: Could not retrieve valid access token', err);
      token = this.authState.accessToken ?? '';
    }

    const wsUrl = `${environment.wsBaseUrl}/ws/activity-feed?token=${encodeURIComponent(token)}`;
    this.socket = new WebSocket(wsUrl);

    // ── Handlers ──────────────────────────────────────────────────────────────

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('ActivityFeedService: ✅ connected');

      // Send initial authentication payload if token exists
      if (token) {
        this.send({
          type: 'auth',
          authorization: `Bearer ${token}`,
          token: token
        });
      }

      this.eventsSubject.next({
        type: 'info',
        message: '✅ Connected to WebSocket feed successfully!',
        url: wsUrl,
        timestamp: new Date().toISOString()
      });
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data: ActivityEvent = JSON.parse(event.data);
        console.log('ActivityFeedService: ← received', data);
        this.eventsSubject.next(data);
      } catch (err) {
        console.error('ActivityFeedService: failed to parse message', err);
        this.eventsSubject.next({
          type: 'warning',
          message: 'Received non-JSON payload',
          raw: event.data
        });
      }
    };

    this.socket.onclose = (ev: CloseEvent) => {
      console.warn(
        `ActivityFeedService: connection closed (code=${ev.code}, reason="${ev.reason}")`
      );
      this.eventsSubject.next({
        type: 'warning',
        message: `⚠️ Connection closed (code ${ev.code})`,
        reason: ev.reason || 'No reason provided'
      });

      if (!this.isManualDisconnect) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (err) => {
      console.error('ActivityFeedService: WebSocket error', err);
      this.eventsSubject.next({
        type: 'error',
        message: '❌ Connection failed / WebSocket Error',
        details: 'Check server connection, endpoint URL, or token authentication.'
      });
      this.socket?.close();
    };
  }

  /** Send a payload to the WebSocket server if connected. */
  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.send(payload);
      console.log('ActivityFeedService: → sent', message);
    } else {
      console.warn('ActivityFeedService: cannot send message - socket is not open');
    }
  }

  /** Cleanly close the connection and cancel any pending reconnect. */
  disconnect(): void {
    this.isManualDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
    if (this.socket) {
      this.socket.onclose = null; // Prevent triggering auto-reconnect on manual close
      this.socket.close();
      this.socket = null;
    }
    console.log('ActivityFeedService: disconnected');
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Exponential back-off reconnect:
   *   attempt 0 → 1 s, attempt 1 → 2 s, attempt 2 → 4 s … capped at 30 s
   */
  private scheduleReconnect(): void {
    if (this.isManualDisconnect) return;

    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectDelay
    );
    console.log(
      `ActivityFeedService: reconnecting in ${delay / 1000}s ` +
      `(attempt #${this.reconnectAttempts + 1})`
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}
