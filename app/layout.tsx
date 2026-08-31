import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Project Controls Assessment',
  description: 'Project controls technical assessment for the Chinaimo Water Treatment Plant project.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
