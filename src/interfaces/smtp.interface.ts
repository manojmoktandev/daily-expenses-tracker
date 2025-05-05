export interface smtpI {
    host: string; 
    port: number;
    secure?: boolean; // Optional (usually true for port 465, false for 587)
    auth: {
      user: string;
      pass: string;
    };
    tls?: {
      rejectUnauthorized?: boolean;
    };
  }