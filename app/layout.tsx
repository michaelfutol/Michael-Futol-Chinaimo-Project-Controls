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
      <body>
        <div style={{position:'fixed',right:14,top:12,zIndex:1000,display:'flex',gap:8,alignItems:'center',padding:'7px 10px',border:'1px solid rgba(120,130,140,.35)',borderRadius:999,background:'rgba(250,250,248,.94)',backdropFilter:'blur(10px)',fontSize:12,fontWeight:700,letterSpacing:'.04em'}} aria-label="Language and concept navigation">
          <a href="/" style={{color:'inherit',textDecoration:'none'}}>ENGLISH</a>
          <span style={{opacity:.35}}>·</span>
          <a href="/ja" style={{color:'inherit',textDecoration:'none'}}>日本語</a>
          <span style={{opacity:.35}}>·</span>
          <a href="/decision-simulator" style={{color:'inherit',textDecoration:'none'}}>BONUS · DECISION SIMULATOR</a>
        </div>
        {children}
      </body>
    </html>
  );
}
