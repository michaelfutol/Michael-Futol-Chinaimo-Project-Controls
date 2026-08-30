import type { Metadata } from 'next';
import assessment from '../../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Recovery Controls Assessment | 日本語',
  description: 'Baseline / Actual Progress / Recovery に絞ったChinaimoプロジェクトコントロール技術評価。'
};

const money=(n:number)=>new Intl.NumberFormat('ja-JP',{maximumFractionDigits:0}).format(n);
const modelJa:Record<string,{name:string,purpose:string}>={
  baseline:{name:'Baseline',purpose:'評価用CPMの基準。上書きせず保存。'},
  actual:{name:'Actual Progress',purpose:'公開された2028年7月目標に整合させた現況／予測モデル。'},
  recovery:{name:'Recovery',purpose:'現場検証を前提とする部分リカバリーのテスト。'}
};

export default function JapanesePage(){
  const m=assessment.meta;
  return <main id="top" lang="ja">
    <div className="projectChrome" aria-label="Project controls workspace">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>Project Controls Recovery Workspace</b><small>Chinaimo 技術評価 · Michael Futol</small></div><span className="projectState">日本語レビュー</span></div>
      <div className="projectRibbon"><span>BASELINE</span><span>STATUS</span><span>RECOVERY</span><b>工程管理正本: Microsoft Project</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy"><div className="eyebrow">MICHAEL FUTOL · PROJECT CONTROLS TECHNICAL ASSESSMENT</div><h1>Chinaimo Recovery Controls</h1><p className="heroLead">公開事実の境界を明確にし、3つの工程状態だけでリカバリー管理を示します。</p><div className="heroTags"><span>Baseline → Actual Progress → Recovery</span><span>Data Date 2026-05-05</span><span>公開進捗 4.19%</span><span>Native Microsoft Project CPM</span></div></div>
      <div className="heroAction"><div className="deliverableLabel">主要提出物</div><a className="primaryBtn" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Master Excel Workbook</b><span>公開事実 · 評価用control data · recovery evidence</span></a><div className="heroButtonRow"><a className="secondaryBtn" href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_JAPANESE_REVIEWER_COMPANION.docx" download>日本語 Reviewer Companion</a><a className="secondaryBtn" href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_FINAL_REVIEWED_EN.docx" download>English Companion</a></div></div>
    </section>

    <section className="notice"><b>評価データ境界:</b> 公開事実を案件の基準点として使用します。Activity期間・logic・詳細status・BOQ配分・Recovery actionは評価用データであり、クボタ建設の内部記録として提示しません。</section>

    <section className="kpis"><Kpi label="公開進捗 · 2026-05-05" value={`${m.publicProgress.toFixed(2)}%`}/><Kpi label="公表工期" value={`${m.publishedDurationMonths}か月`}/><Kpi label="公開工事パッケージ金額" value={`¥${money(m.publicPackageValue)}`}/><Kpi label="最新公開完成目標" value="2028年7月"/></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">01 · PUBLIC RECORD</span><h2>なぜRecovery Controlが重要なのか</h2><p>公開情報では、工事は2025年10月開始・30か月・2028年／2028年初頭完成の文脈でした。2026-05-05には全体進捗4.19%、完成目標は2028年7月と報じられています。</p></div><span className="statusPill muted">PUBLIC ANCHORS</span></div><div className="commentaryRule"><b>解釈</b><span><strong>Fact:</strong> 4.19%は公開された全体進捗。</span><span><strong>Implication:</strong> Current ForecastとRecoveryの管理が重要。</span><span><strong>Boundary:</strong> 原因・責任・EOT権利は実プロジェクト記録で確認。</span></div></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">02 · THREE-MODEL GOVERNANCE</span><h2>Baseline → Actual Progress → Recovery</h2><p>以前の複数Scenarioファイルはレビュアー向け提出から外しました。実務上重要な3つの工程状態だけを残します。</p></div></div><div className="scenarioGrid">{assessment.models.map((model,index)=>{const j=modelJa[model.id];return <article className="scenario" key={model.id}><div className="scenarioTop"><span>{String(index+1).padStart(2,'0')}</span><b className={model.id==='actual'?'impactBad':'impactOk'}>{model.delta}</b></div><h3>{j.name}</h3><p className="activityName">基準日: {model.anchor}</p><div className="scenarioDates"><div><small>予測完了</small><b>{model.finish}</b></div></div><div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{j.purpose}</strong></div><a className="miniDownload" href={`/downloads/${model.file}`} download>Native .mpp ↓</a></article>})}</div><p className="controlNote"><b>重要:</b> Baselineとの差143作業日は評価モデル間の予測差です。契約遅延、EOT権利、責任判断として提示していません。</p></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">03 · RECOVERY TEST</span><h2>全回復を装わず、部分Recoveryを検証</h2><p>Current Forecast 2028-07-31から60作業日の改善をテストし、2028-05-22をRecovery Targetとします。評価Baselineとの差は83作業日残ります。</p></div><span className="statusPill">FIELD-VALIDATE</span></div><div className="tableScroll"><table><thead><tr><th>Activity</th><th>Workfront</th><th>目標</th><th>Assessment action</th><th>実施Gate</th></tr></thead><tbody>{assessment.recoveryActions.map(r=><tr key={r.activity}><td><code>{r.activity}</code></td><td>{r.workfront}</td><td>{r.gain}作業日</td><td>{r.action}</td><td>{r.gate}</td></tr>)}</tbody></table></div><div className="controlRule"><b>Recovery Approval Gate</b><span>Construction</span><span>Engineering</span><span>Procurement</span><span>QA/QC</span><span>HSE</span><span>Commercial</span></div></section>

    <section className="panel downloads" id="downloads"><div className="downloadIntro"><span className="sectionNo">04 · SIX SUBMISSION FILES</span><h2>余分なファイルを提出しない</h2><p>Master Excel 1件、Word 2件、Native Microsoft Project 3件のみ。</p></div><div className="downloadGrid"><a href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Master Excel</b><span>.xlsx · public status · recovery control</span><em>DOWNLOAD ↓</em></a><a href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_JAPANESE_REVIEWER_COMPANION.docx" download><b>Reviewer Companion — 日本語</b><span>.docx · 3-model defence · recovery method</span><em>DOWNLOAD ↓</em></a><a href="/downloads/CHINAIMO_PROJECT_CONTROLS_QA_FINAL_REVIEWED_EN.docx" download><b>Reviewer Companion — English</b><span>.docx · technical authority companion</span><em>DOWNLOAD ↓</em></a>{assessment.models.map(model=><a href={`/downloads/${model.file}`} download key={model.id}><b>{modelJa[model.id].name} — Microsoft Project</b><span>.mpp · {model.finish}</span><em>DOWNLOAD MPP ↓</em></a>)}</div></section>

    <section className="panel" id="sources"><div className="sectionHead"><div><span className="sectionNo">05 · SOURCES</span><h2>公開事実は独立確認可能</h2><p>評価の基準点として使用した公開情報です。</p></div></div><div className="sourceList">{assessment.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label} ↗</a>)}</div></section>

    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls Recovery Assessment · 日本語レビュー</span></div><a href="#top">Top ↑</a></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}