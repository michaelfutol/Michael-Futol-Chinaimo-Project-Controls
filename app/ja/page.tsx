import type { Metadata } from 'next';
import assessment from '../../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Recovery Controls Assessment | 日本語',
  description: 'Baseline / Actual Progress / Recovery に絞ったChinaimoプロジェクトコントロール技術評価。'
};

const money=(n:number)=>new Intl.NumberFormat('ja-JP',{maximumFractionDigits:0}).format(n);
const pct=(n:number)=>`${n.toFixed(2)}%`;
const modelJa:Record<string,{name:string,purpose:string}>={
  baseline:{name:'Baseline',purpose:'評価用CPMの基準。履歴として保存し、上書きしない。'},
  actual:{name:'Actual Progress',purpose:'2026-08-31をData Dateとする現況／予測モデル。'},
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
      <div className="heroCopy"><div className="eyebrow">MICHAEL FUTOL · PROJECT CONTROLS TECHNICAL ASSESSMENT</div><h1>Chinaimo Recovery Controls</h1><p className="heroLead">公開事実と評価用仮定を分離し、Baseline・現況・Recoveryに必要な管理だけを簡潔に示します。</p><div className="heroTags"><span>Baseline → Actual Progress → Recovery</span><span>Assessment Data Date · 2026-08-31</span><span>評価用BOQ進捗 · {pct(m.assessmentProgress)}</span><span>公開チェックポイント · {pct(m.publicProgress)} @ 2026-05-05</span></div></div>
      <div className="heroAction"><div className="deliverableLabel">正式提出物</div><div className="notice" style={{margin:0}}><b>提出は6ファイルのみ。</b><br/>Master Excel 1件 · Word 2件 · Native Microsoft Project 3件。</div></div>
    </section>

    <section className="notice"><b>評価データ境界:</b> 公開事実を案件の基準点として使用します。Activity期間・logic・詳細status・BOQ配分・Recovery actionは評価用データであり、クボタ建設の内部記録として提示しません。</section>

    <section className="kpis"><Kpi label="評価用進捗 · 2026-08-31" value={pct(m.assessmentProgress)}/><Kpi label="公開進捗 · 2026-05-05" value={pct(m.publicProgress)}/><Kpi label="公表工期" value={`${m.publishedDurationMonths}か月`}/><Kpi label="最新公開完成目標" value={m.publicCurrentCompletion}/></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">01 · PUBLIC FACTS + ASSESSMENT STATUS</span><h2>公開情報を使いながら、内部実績とは混同しない</h2><p>公開情報では工事開始は2025年10月、実施期間は30か月です。本評価で使用する最新のChinaimo固有の公開進捗は2026-05-05時点の{pct(m.publicProgress)}で、完成目標は{m.publicCurrentCompletion}と報じられています。雇用評価用モデルではData Dateを2026-08-31とし、BOQ／金額加重の進捗を{pct(m.assessmentProgress)}としてシミュレーションしています。</p></div><span className="statusPill muted">BOUNDARY CONTROL</span></div><div className="commentaryRule"><b>区分</b><span><strong>公開事実:</strong> 2026-05-05時点 {pct(m.publicProgress)}。</span><span><strong>評価シミュレーション:</strong> 2026-08-31時点 {pct(m.assessmentProgress)}。</span><span><strong>主張しない事項:</strong> クボタ建設の内部Activity実績、遅延責任、EOT権利、機密商務データ。</span></div></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">02 · THREE-MODEL GOVERNANCE</span><h2>Baseline → Actual Progress → Recovery</h2><p>Original Assessment Baselineは履歴として保存します。月次更新ではActual、Remaining Duration、Forecastを更新しますが、過去のBaselineは書き換えません。Revised Baselineは、正式承認された変更により本当にRebaselineが必要な場合のみ作成します。</p></div></div><div className="scenarioGrid">{assessment.models.map((model,index)=>{const j=modelJa[model.id];return <article className="scenario" key={model.id}><div className="scenarioTop"><span>{String(index+1).padStart(2,'0')}</span><b className={model.id==='actual'?'impactBad':'impactOk'}>{model.delta}</b></div><h3>{j.name}</h3><p className="activityName">基準日: {model.anchor}</p><div className="scenarioDates"><div><small>予測完了</small><b>{model.finish}</b></div></div><div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{j.purpose}</strong></div></article>})}</div><p className="controlNote"><b>契約上の境界:</b> Baselineとの差{m.currentDifferenceWorkingDays}作業日は評価モデル間のForecast差であり、自動的にEOT、補償対象遅延、責任判定を意味しません。</p></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">03 · RECOVERY TEST</span><h2>見栄えではなく、説明できるRecoveryを残す</h2><p>評価用RecoveryはCurrent Forecast {m.currentForecast}から{m.recoveryGainWorkingDays}作業日の改善を目標とし、{m.recoveryForecast}まで短縮するテストです。Assessment Baselineとの差{m.residualDifferenceWorkingDays}作業日は、Rebaselineで隠さず残します。</p></div><span className="statusPill">FIELD-VALIDATE</span></div><div className="tableScroll"><table><thead><tr><th>Activity</th><th>Workfront</th><th>目標</th><th>Assessment action</th><th>実施Gate</th></tr></thead><tbody>{assessment.recoveryActions.map(r=><tr key={r.activity}><td><code>{r.activity}</code></td><td>{r.workfront}</td><td>{r.gain}作業日</td><td>{r.action}</td><td>{r.gate}</td></tr>)}</tbody></table></div><div className="controlRule"><b>Recovery Approval Gate</b><span>Construction</span><span>Engineering</span><span>Procurement</span><span>QA/QC</span><span>HSE</span><span>Commercial</span></div></section>

    <section className="panel"><div className="sectionHead"><div><span className="sectionNo">04 · MONTHLY CONTROL / IPC</span><h2>月次管理はシンプルな一連の流れで示す</h2><p>本評価では月次報告を作業上の明確なConventionとして使用します。Measurement → Earned Progress → Current Forecast → Sample Interim Payment Certificateの順です。実際の請求締日、Retention、Advance Recovery、税、認証条件はContract Particular Conditionsに従います。</p></div></div><div className="commentaryRule"><b>Baseline Governance</b><span><strong>Rev 0:</strong> Original Assessment Baselineを保存。</span><span><strong>Monthly Update:</strong> Actual、Remaining Duration、Forecastを更新。</span><span><strong>Revised Baseline:</strong> 正式承認された変更で必要な場合のみ作成。</span></div></section>

    <section className="panel downloads" id="submission"><div className="downloadIntro"><span className="sectionNo">05 · FORMAL ATTACHMENT SET</span><h2>正式提出は6ファイルのみ</h2><p>Webサイトはレビュー用の説明レイヤーです。正本ファイルは応募時に直接添付します。</p></div><div className="authorityGrid"><div><span className="authorityTool">EXCEL</span><b>Michael_Futol_Chinaimo_Project_Controls.xlsx</b><p>月次StatusとSample IPCを含むMaster Controls Workbook。</p></div><div><span className="authorityTool">WORD</span><b>English + 日本語 reviewer companions</b><p>簡潔なReviewer FAQとControl rationale。</p></div><div><span className="authorityTool">MS PROJECT</span><b>Baseline + Actual Progress + Recovery</b><p>Native .mpp 3件のみ。</p></div></div></section>

    <section className="panel" id="sources"><div className="sectionHead"><div><span className="sectionNo">06 · SOURCES</span><h2>公開事実は独立確認可能</h2><p>公開情報と評価用データを分離しています。公開工事パッケージ金額: ¥{money(m.publicPackageValue)}。</p></div></div><div className="sourceList">{assessment.sources.map(s=><a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label} ↗</a>)}</div></section>

    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls Recovery Assessment · 日本語レビュー</span></div><a href="#top">Top ↑</a></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}