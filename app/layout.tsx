import './globals.css';
import './refinements.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Telemetry from './Telemetry';
import Enhancements from './Enhancements';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Project Controls Assessment',
  description: 'Project controls technical assessment for the Chinaimo Water Treatment Plant project.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Enhancements />
        <Telemetry />
        <Analytics mode="production" />
      </body>
    </html>
  );
}
