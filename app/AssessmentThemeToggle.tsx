'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'chinaimo_assessment_theme';
type Theme = 'light' | 'dark';

export default function AssessmentThemeToggle(){
  const pathname = usePathname();
  const [theme,setTheme] = useState<Theme>('light');

  useEffect(()=>{
    if(pathname !== '/') return;
    let saved: Theme = 'light';
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if(value === 'dark' || value === 'light') saved = value;
    } catch {}
    setTheme(saved);
    document.documentElement.dataset.assessmentTheme = saved;
    return ()=>{ delete document.documentElement.dataset.assessmentTheme; };
  },[pathname]);

  if(pathname !== '/') return null;

  const toggle = ()=>{
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.assessmentTheme = next;
    try { localStorage.setItem(STORAGE_KEY,next); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch assessment to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        position:'fixed',right:18,top:18,zIndex:1000,
        minHeight:40,padding:'9px 13px',borderRadius:4,
        border:'1px solid color-mix(in srgb, currentColor 28%, transparent)',
        background:theme === 'dark' ? 'rgba(25,32,35,.92)' : 'rgba(246,245,239,.94)',
        color:theme === 'dark' ? '#eee8da' : '#27353d',
        boxShadow:'0 4px 16px rgba(0,0,0,.08)',backdropFilter:'blur(8px)',
        font:"700 12.5px/1.2 'Courier New',ui-monospace,monospace",
        letterSpacing:'.035em',textTransform:'uppercase',cursor:'pointer'
      }}
    >
      <span aria-hidden="true" style={{marginRight:7,fontSize:14}}>{theme === 'dark' ? '☀' : '☾'}</span>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
