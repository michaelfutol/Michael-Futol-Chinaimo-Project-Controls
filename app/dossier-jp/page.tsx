import type { Metadata } from 'next';
import Link from 'next/link';
import assessment from '../../data/assessment.json';

export const metadata: Metadata = {
  title: 'Michael Futol - Chinaimo Japanese Reviewer Dossier',
  description: 'Japanese reviewer dossier reconciled to the QA-passed native Microsoft Project CPM results.'
};

const pct=(n:number)=>`${n.toFixed(3)}%`;
const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
const baseline=assessment.models.find(m=>m.id==='baseline')!;
const current=assessment.models.find(m=>m.id==='actual')!;
const recovery=assessment.models.find(m=>m.id==='recovery')!;
const recoveredShare=Math.round((assessment.meta.recoveryGainWorkingDays/assessment.meta.currentDifferenceWorkingDays)*100);
const residualShare=100-recoveredShare;

export default function JapaneseDossier(){
  const m=assessment.meta;
  return <main id="top">
    <div className="projectChrome" aria-label="Japanese reviewer dossier header">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>PROJECT CONTROLS DOSSIER / CHINAIMO</b><small>Michael Futol · Native CPM reconciled reviewer edition</small></div><span className="projectState">JP DOSSIER</span></div>
      <div className="projectRibbon"><span>BASELINE</span><span>STATUS</span><span>RECOVERY</span><b>{m.scheduleAuthority}</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">TECHNICAL ASSESSMENT / CONTROL BRIEF</div>
        <h1>チャイナイモ・プロジェクト工程リカバリー評価</h1>
        <p className="heroLead">データ基準日：2026年8月31日。公開情報と評価シミュレーションを明確に分離し、Excel と 3 つのネイティブ Microsoft Project モデルを監査可能な形で説明します。</p>
        <div className="heroTags"><span>Baseline → Actual Progress → Recovery</span><span>Native CPM QA PASS</span><span>公開値 4.19% @ 05-May-2026</span><span>評価進捗 {pct(m.assessmentProgress)}</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">REVIEWER NOTE</div>
        <div className="notice" style={{margin:0}}><b>補足プレゼンテーション資料です。</b><br/>工程・CPM の最終権威はネイティブ Microsoft Project ファイルです。July 2028 は公開目標であり、Current Forecast を強制する日付ではありません。</div>
        <Link className="primaryBtn" href="/"><b>English assessment</b><span>Return to the primary reviewer page</span></Link>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 · TECHNICAL ASSESSMENT / CONTROL BRIEF</span><h2>提出の目的とデータ境界</h2><p>Rev 0 を評価参照として保全し、実績更新・予測・リカバリーで上書きしません。採用後は評価用シミュレーションを実際の承認済工程、数量、調達、現場実績へ置き換えます。</p></div><span className="statusPill muted">BOUNDARY CONTROL</span></div>
      <div className="kpis">
        <Kpi label="施工開始 / Public anchor" value="Oct-2025"/>
        <Kpi label="公開工期" value={`${m.publishedDurationMonths} months`}/>
        <Kpi label="公開パッケージ契約額" value={`JPY ${money(m.publicPackageValue)}`}/>
        <Kpi label="評価用予算管理額" value={`JPY ${money(m.assessmentControlValue)}`}/>
      </div>
      <div className="commentaryRule"><b>公開基準データ / 評価シミュレーション</b><span><strong>公開進捗:</strong> {m.publicProgress}% @ 05-May-2026</span><span><strong>評価進捗:</strong> {pct(m.assessmentProgress)} @ 31-Aug-2026</span><span><strong>原則:</strong> Kubota の内部実績・責任・請求権・機密 BOQ として表示しない。</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 · SCHEDULE GOVERNANCE</span><h2>3モデル工程管理ガバナンスと差異分析</h2><p>ベースラインの完全性を維持しつつ、Actual Progress / Current Forecast と Partial Recovery を別モデルとして可視化します。</p></div><span className="statusPill">NATIVE CPM</span></div>
      <div className="scenarioGrid">
        <Scenario no="01" title="ベースライン Rev 0" finish={baseline.finish} delta="0 wd" note="評価用 CPM 基準。履歴として凍結・保存。" />
        <Scenario no="02" title="実績予測 / Current Forecast" finish={current.finish} delta={`+${m.currentDifferenceWorkingDays} wd`} note={`Native CPM forecast。公開 July 2028 は別の target reference。`} bad />
        <Scenario no="03" title="リカバリー" finish={recovery.finish} delta={`${m.recoveryGainWorkingDays} wd recovered / ${m.residualDifferenceWorkingDays} wd residual`} note="部分 Recovery。施工性・HSE・QA/QC・調達・リソースを現場検証。" />
      </div>
      <div className="commentaryRule"><b>鉄則</b><span>Original Assessment Baseline Rev 0 は月次更新で上書きしない。</span><span>Current Forecast は <strong>{current.finish}</strong>。</span><span>Public July 2028 target と Native CPM forecast を混同しない。</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 · STATUSING / PROGRESS</span><h2>データ基準日規則と進捗率の概念的切り分け</h2><p>完了済作業は履歴として固定し、未完了作業は Data Date 以降へ再予測します。BOQ / Earned Value の進捗率と Schedule % Complete は論理的に整合させますが、数値を強制一致させません。</p></div></div>
      <div className="authorityGrid">
        <div><span className="authorityTool">TIMELINE</span><b>2026-08-31</b><p>完了済作業は履歴として保持。未完了作業は基準日以降で再予測。</p></div>
        <div><span className="authorityTool">BOQ / VALUE</span><b>{pct(m.assessmentProgress)}</b><p>評価シミュレーション。Earned Quantity / Value を測定。</p></div>
        <div><span className="authorityTool">SCHEDULE</span><b>Native MPP calculation</b><p>スケジュール status と残作業の配置を Microsoft Project で再計算。</p></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">04 · CHANGE / BASELINE CONTROL</span><h2>変更管理とベースライン改訂フロー</h2><p>Variation / EOT の要求があっても、正式承認前は Rev 0 を変更せず、予測・コスト・リスクへの影響のみを評価します。</p></div></div>
      <div className="commentaryRule"><b>承認境界</b><span><strong>NO approval:</strong> Working status model に影響を統合、Rev 0 完了日は維持。</span><span><strong>Approved but no time change:</strong> Scope / cost 記録のみ更新。</span><span><strong>Approved time change:</strong> Approved Revised Baseline (Rev n) を新規発行し、Rev 0 も保存。</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">05 · COMMERCIAL / IPC</span><h2>スケジュール進捗からキャッシュフローへの変換</h2><p>月次報告と中間出来高払請求の評価サンプルです。実際の retention、advance recovery、税、minimum IPC、認定条件は Contract Particular Conditions を優先します。</p></div></div>
      <div className="kpis">
        <Kpi label="評価用予算" value={`JPY ${money(m.assessmentControlValue)}`}/>
        <Kpi label="累積進捗率" value={pct(m.assessmentProgress)}/>
        <Kpi label="今回進捗率" value="2.595%"/>
        <Kpi label="今回純支払額 / Sample IPC" value="JPY 140,130,000"/>
      </div>
      <div className="controlRule"><b>MONTHLY CONTROL CYCLE</b><span>01 数量・出来高</span><span>02 前回 / 今回</span><span>03 保留金・控除</span><span>04 認定境界</span><span>05 キャッシュフロー</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">06 · RECOVERY / ONBOARDING</span><h2>現実的なリカバリー戦略と実プロジェクトへの移行</h2><p>工程表上で数字だけを短くするのではなく、施工可能性に裏打ちされた Recovery として扱います。</p></div><span className="statusPill">FIELD VALIDATE</span></div>
      <div className="scenarioGrid">
        <article className="scenario"><div className="scenarioTop"><span>RECOVERED</span><b className="impactOk">{recoveredShare}%</b></div><h3>{m.recoveryGainWorkingDays} working days</h3><p className="activityName">Current {current.finish} → Recovery {recovery.finish}</p><div className="solutionBox"><small>回収</small><strong>Native CPM network result</strong></div></article>
        <article className="scenario"><div className="scenarioTop"><span>RESIDUAL</span><b>{residualShare}%</b></div><h3>{m.residualDifferenceWorkingDays} working days</h3><p className="activityName">Recovery vs Rev 0 baseline</p><div className="solutionBox"><small>現地検証対象</small><strong>追加対策は constructability / HSE / QA/QC / procurement / resources を検証</strong></div></article>
        <article className="scenario"><div className="scenarioTop"><span>DAY 1</span><b>LIVE CONTROL</b></div><h3>Kubota 実データへ移行</h3><p className="activityName">承認済工程表 → 実績・調達 → 監査可能な更新履歴</p><div className="solutionBox"><small>ONBOARDING</small><strong>評価モデルを実プロジェクトの live controls に置換</strong></div></article>
      </div>
      <div className="controlRule"><b>VALIDATION</b><span>QA/QC</span><span>HSE</span><span>RESOURCES</span><span>PROCUREMENT</span><span>CONSTRUCTION</span><span>COMMERCIAL</span></div>
    </section>

    <section className="notice"><b>Authority hierarchy:</b> この Web dossier は reviewer-facing supporting presentation。数量・商務ロジックは Master Excel、工程・CPM の結果は 3 つの Native Microsoft Project files が基準です。</section>
    <footer><div><b>Michael Futol</b><span>Chinaimo Project Controls - Japanese Reviewer Dossier</span></div><Link href="/">English assessment</Link></footer>
  </main>
}

function Kpi({label,value}:{label:string,value:string}){return <div className="kpi"><small>{label}</small><strong>{value}</strong></div>}
function Scenario({no,title,finish,delta,note,bad=false}:{no:string,title:string,finish:string,delta:string,note:string,bad?:boolean}){return <article className="scenario"><div className="scenarioTop"><span>{no}</span><b className={bad?'impactBad':'impactOk'}>{delta}</b></div><h3>{title}</h3><p className="activityName">Forecast finish</p><div className="scenarioDates"><div><small>NATIVE CPM FINISH</small><b>{finish}</b></div></div><div className="solutionBox"><small>CONTROL PURPOSE</small><strong>{note}</strong></div></article>}
