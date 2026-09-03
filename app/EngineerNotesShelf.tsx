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
      <div class="engineers-notes-heading-row">
        <div>
          <div class="engineers-notes-kicker">SUPPLEMENTAL READING · 技術ノート</div>
          <h2>Engineer's Notes <span lang="ja">技術ノート</span></h2>
        </div>
        <p class="engineers-notes-intro">Optional technical notes on the reasoning behind project controls and recovery. Separate from the Chinaimo evidence set.</p>
      </div>
      <div class="engineers-notes-grid">
        <a class="engineers-note-card" href="/engineers-notes/001">
          <div class="engineers-note-number">NOTE 001 · v1.2</div>
          <div class="engineers-note-title">On Forensic Project Recovery</div>
          <div class="engineers-note-meta">Recovery Engineering / Project Controls</div>
          <p>Investigate the delay before attempting to compress it.</p>
          <div class="engineers-note-action">READ →</div>
        </a>
        <a class="engineers-note-card" href="/engineers-notes/002">
          <div class="engineers-note-number">NOTE 002 · v1.1</div>
          <div class="engineers-note-title">Value Over Recovery</div>
          <div class="engineers-note-meta">Recovery Engineering / Value Recovery</div>
          <p>Why the fastest recovery programme is not always the best project decision.</p>
          <div class="engineers-note-action">READ →</div>
        </a>
      </div>
    `;

    article.appendChild(section);
    return () => section.remove();
  },[]);

  return <style>{`
    .engineers-notes-shelf{padding:22px 42px 25px;border-top:1px solid #c8cbc7;background:#f8f8f4;color:#334047}
    .engineers-notes-heading-row{display:grid;grid-template-columns:minmax(230px,.72fr) minmax(360px,1.28fr);gap:24px;align-items:end;margin-bottom:13px}
    .engineers-notes-kicker{font:700 9.5px/1.3 'Courier New',monospace;letter-spacing:.11em;color:#8e4539;margin-bottom:5px}
    .engineers-notes-shelf h2{margin:0;font-family:'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif;font-size:24px;line-height:1.08;font-weight:600;color:#25353c}
    .engineers-notes-shelf h2 span{display:inline;margin-left:9px;font-family:Arial,'Helvetica Neue','Noto Sans JP',sans-serif;font-size:10.5px;font-weight:500;letter-spacing:.06em;color:#777d7f}
    .engineers-notes-intro{max-width:650px;margin:0;font-size:13.5px;line-height:1.5;color:#666d70}
    .engineers-notes-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
    .engineers-note-card{display:block;padding:14px 16px 13px;border:1px solid #c1c3bf;background:rgba(251,250,247,.65);color:inherit;text-decoration:none;transition:background .14s ease,border-color .14s ease,transform .14s ease}
    .engineers-note-card:hover{transform:translateY(-1px);background:#fbfaf7;border-color:#858d8d}
    .engineers-note-number{font:700 9.5px/1.3 'Courier New',monospace;letter-spacing:.07em;color:#8e4539}
    .engineers-note-title{margin-top:5px;font-family:'Bodoni 72',Didot,'Bodoni MT',Baskerville,'Times New Roman',serif;font-size:19px;line-height:1.1;font-weight:600;color:#263840}
    .engineers-note-meta{margin-top:4px;font:700 10px/1.35 'Courier New',monospace;letter-spacing:.025em;color:#72787a}
    .engineers-note-card p{margin:7px 0 8px;font-size:13px;line-height:1.42;color:#626a6d}
    .engineers-note-action{font:700 9.5px/1.2 'Courier New',monospace;letter-spacing:.06em;color:#46565c}
    main article section > div[style*="Courier New"]{font-size:13.5px!important;line-height:1.75!important}
    main article > header > div:first-child{font-size:11.5px!important}
    @media(max-width:720px){.engineers-notes-shelf{padding:20px}.engineers-notes-heading-row{grid-template-columns:1fr;gap:7px;align-items:start}.engineers-notes-grid{grid-template-columns:1fr}.engineers-notes-shelf h2{font-size:22px}.engineers-notes-intro{font-size:13px}.engineers-note-title{font-size:18px}}
  `}</style>;
}
