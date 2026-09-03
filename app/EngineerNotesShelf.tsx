'use client';

import { useEffect } from 'react';

export default function EngineerNotesShelf(){
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    const article = document.querySelector('main article');
    if (!article || article.querySelector('[data-engineers-notes]')) return;

    const section = document.createElement('section');
    section.setAttribute('data-engineers-notes','1');
    section.className = 'engineers-notes-shelf';
    section.innerHTML = `
      <div class="engineers-notes-kicker">SUPPLEMENTAL TECHNICAL READING · 技術ノート</div>
      <h2>Engineer's Notes <span lang="ja">技術ノート</span></h2>
      <p class="engineers-notes-intro">Independent technical notes on project controls, recovery engineering, value, and emerging computation. These notes explain methodology and professional reasoning; they are supplemental reading and are not part of the Chinaimo project evidence set.</p>
      <a class="engineers-note-card" href="/engineers-notes/001">
        <div class="engineers-note-number">ENGINEER'S NOTE 001 · v1.2</div>
        <div class="engineers-note-title">On Forensic Project Recovery</div>
        <div class="engineers-note-meta">Project Controls / Recovery Engineering / Value Recovery</div>
        <p>Why substantial delay requires investigation before acceleration -- and why time recovered must preserve more value than it consumes.</p>
        <div class="engineers-note-action">READ IN BROWSER →</div>
      </a>
    `;

    article.appendChild(section);
    return () => section.remove();
  },[]);

  return <style>{`
    .engineers-notes-shelf{padding:34px 42px 42px;border-top:1px solid #c8cbc7;background:#f8f8f4;color:#334047}
    .engineers-notes-kicker{font:700 10px/1.3 'Courier New',monospace;letter-spacing:.12em;color:#8e4539;margin-bottom:9px}
    .engineers-notes-shelf h2{margin:0;font-family:'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif;font-size:34px;line-height:1.08;font-weight:600;color:#25353c}
    .engineers-notes-shelf h2 span{display:block;margin-top:5px;font-family:Arial,'Helvetica Neue','Noto Sans JP',sans-serif;font-size:12px;font-weight:500;letter-spacing:.08em;color:#777d7f}
    .engineers-notes-intro{max-width:880px;margin:13px 0 20px;font-size:15px;line-height:1.65;color:#60696d}
    .engineers-note-card{display:block;max-width:980px;padding:24px 26px;border:1px solid #b8bcb8;background:#fbfaf7;color:inherit;text-decoration:none;box-shadow:0 5px 18px rgba(37,48,53,.035);transition:transform .14s ease,border-color .14s ease,box-shadow .14s ease}
    .engineers-note-card:hover{transform:translateY(-2px);border-color:#7f8989;box-shadow:0 8px 22px rgba(37,48,53,.065)}
    .engineers-note-number{font:700 10px/1.3 'Courier New',monospace;letter-spacing:.09em;color:#8e4539}
    .engineers-note-title{margin-top:8px;font-family:'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif;font-size:29px;line-height:1.12;font-weight:600;color:#263840}
    .engineers-note-meta{margin-top:6px;font:700 10.5px/1.4 'Courier New',monospace;letter-spacing:.035em;color:#687174}
    .engineers-note-card p{max-width:780px;margin:13px 0 16px;font-size:14.5px;line-height:1.62;color:#5b6569}
    .engineers-note-action{font:700 10.5px/1.2 'Courier New',monospace;letter-spacing:.07em;color:#33464e}
    @media(max-width:720px){.engineers-notes-shelf{padding:26px 20px 32px}.engineers-notes-shelf h2{font-size:29px}.engineers-note-card{padding:20px}.engineers-note-title{font-size:25px}}
  `}</style>;
}
