import './globals.css';
import './governance.css';
import './editorial.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Project Controls Assessment',
  description: 'Auditable BOQ, progress, scheduling, critical path, delay, payment-claim and ISO-aligned project-controls assessment.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="languageRibbon" aria-label="Language and concept navigation">
          <a href="/">English</a>
          <span className="sep">·</span>
          <a href="/ja">日本語</a>
          <span className="sep">·</span>
          <a href="/decision-simulator">Bonus · Decision Simulator</a>
        </div>
        {children}
      </body>
    </html>
  );
}
