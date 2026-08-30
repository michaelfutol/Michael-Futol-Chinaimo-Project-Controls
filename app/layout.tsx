import './globals.css';
import './governance.css';
import './editorial.css';
import type { Metadata } from 'next';
import SubmissionFileGuard from './SubmissionFileGuard';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Recovery Controls Assessment',
  description: 'Lean Chinaimo project-controls assessment: public facts, Baseline, Actual Progress and Recovery.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en"><body>
      <div className="languageRibbon" aria-label="Language navigation"><a href="/">English</a><span className="sep">·</span><a href="/ja">日本語</a></div>
      {children}
      <SubmissionFileGuard />
    </body></html>
  );
}