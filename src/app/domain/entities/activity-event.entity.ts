export interface ActivityEvent {
  type: string;
  user?: string;
  username?: string;
  action?: string;
  target?: string;
  message?: string;
  timestamp?: string;
  [key: string]: any;
}
