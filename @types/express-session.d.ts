export {};

declare module 'express-session' {
  export interface SessionData {
    messages?: string[];
  }
}
