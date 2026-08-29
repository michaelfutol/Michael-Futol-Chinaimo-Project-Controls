import './globals.css';
import './governance.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Project Controls Assessment',
  description: 'Auditable BOQ, progress, scheduling, critical path, delay, payment-claim and ISO-aligned project-controls assessment.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
