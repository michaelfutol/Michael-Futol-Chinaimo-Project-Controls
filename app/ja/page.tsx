import type { Metadata } from 'next';
import assessment from '../../data/assessment.json';
import schedule from '../../data/schedule.json';
import governance from '../../data/governance.json';
import ProgressExplorer from '../ProgressExplorer';
import ScheduleExplorer from '../ScheduleExplorer';

export const metadata: Metadata = {
  title: 'Michael Futol — Chinaimo Project Controls Assessment | 日本語',
  description: 'Chinaimoプロジェクトコントロール技術評価の日本語レビュー用コンパニオンページ。'
};

const money=(n:number)=>new Intl.NumberFormat('ja-JP',{maximumFractionDigits:0}).format(n);
const pct=(n:number)=>`${n.toFixed(3)}%`;
const qty=(n:number)=>new Intl.NumberFormat('ja-JP',{maximumFractionDigits:2}).format(n);

const scenarioJa: Record<string,{name:string,effect:string,why:string}> = {
  A:{
    name:'クリティカル工程遅延',
    effect:'クリティカルパス上の遅延として完了日に影響。',
    why:'WTPのRapid Sand Filter Structureは本評価モデルの支配工程上にあるため、10作業日の追加は後続のWTP・配管・計装・試運転ロジックへ伝播します。Microsoft ProjectのCPM再計算により、完了日は15-Jan-2029から26-Jan-2029へ移動します。'
  },
  B:{
    name:'非クリティカル工程遅延',
    effect:'活動遅延は発生するが、プロジェクト完了日は変わらない。',
    why:'Administration & Laboratory Buildingは本テストネットワークでは並行する非クリティカル経路にあり、15作業日の遅延は利用可能なフロートを消費するものの、完了マイルストーンを動かしません。管理上は残存フロートと後続インターフェースを監視します。'
  },
  C:{
    name:'同時遅延',
    effect:'遅延日数の単純加算ではなく、支配経路の影響で評価。',
    why:'クリティカルWTP活動の+10作業日と非クリティカル建屋活動の+15作業日は合計25日ですが、CPM上の完了影響は+10作業日です。遅延イベントは算術的に加算せず、ロジック経路・フロート・同時性を確認します。'
  },
  D:{
    name:'調達ウォッチ',
    effect:'現時点では完了日への影響なし。ただし調達フロートを消費。',
    why:'Electrical / Receiving Equipment Procurementの10作業日遅延は本テストでは完了日を動かしませんが、必要現場搬入日、承認、製作、輸送、受入、通電・試運転インターフェースを早期に監視する必要があります。'
  }
};

const faq=[
  ['本評価におけるクリティカルパスは何ですか？','本評価モデルでは、NTP、動員・測量からChinaimo WTPの主要土木工程へ入り、Rapid Sand Filter Structure、構造水張り試験、Process Piping、Instrumentation & SCADA、Electrical / I&C Pre-Commissioning、Dry / Wet Commissioning、Performance / Water Quality Testing、Punch Listを経てTaking Over / Completion Milestoneへ至る連鎖が支配工程です。ベースライン完了日は15-Jan-2029です。'],
  ['なぜScenario Aは10作業日のプロジェクト遅延になるのですか？','WTP-CIV-060に追加した10作業日がクリティカルパス上で後続ロジックへ伝播するためです。Microsoft ProjectのネイティブCPM再計算により、完了日は15-Jan-2029から26-Jan-2029へ移動します。'],
  ['なぜScenario Bは活動が15日遅れてもプロジェクト遅延が0日なのですか？','活動遅延とプロジェクト遅延は同義ではありません。BLDG-030は本モデルでは並行する非クリティカル経路にあり、遅延はフロートを消費しますが最終完了を動かしません。'],
  ['なぜScenario Cの遅延は25日ではないのですか？','+10日と+15日を単純加算しないためです。支配WTP経路が完了を決め、建屋側の遅延は並行経路のフロート内に残るため、CPM上のネット影響は+10作業日です。'],
  ['−7.475ポイントの進捗差は7.475%の工程遅延を意味しますか？','いいえ。計画47.000%、実績39.525%、差異−7.475ポイントは価値加重進捗のパフォーマンス指標です。時間遅延は、データ日でステータス更新したCPMネットワーク、残存ロジック、フロート、クリティカル／準クリティカル経路、予測完了日から判断します。'],
  ['回復工程では何を変更していますか？','Scenario Aを起点に、WTP-CIV-070 Internal Channels / Pipe Galleriesを45日から40日へ、WTP-CIV-080 Waterproofing / Protective Coatingを30日から25日へする、各5作業日の回復ターゲットを設定しています。合計10作業日の回復により、CPM再計算上の完了日は15-Jan-2029へ戻ります。'],
  ['なぜ回復工程をベースラインとは別に保持するのですか？','ベースラインは当初承認されたコミットメントを保存する基準です。回復案でベースラインを書き換えると、元の約束と差異の証拠が失われます。そのため、ベースライン、現況／遅延予測、回復工程を別々に管理します。'],
  ['回復期間を短縮すればよいだけではないのですか？','いいえ。ガント上で日数を短くすることと、現場で実行可能な回復は別です。実施前にConstruction、Engineering、Procurement、QA/QC、HSE、Commercialと協議し、作業面、図面、資材、要員・機械、検査・養生、安全、品質、追加費用を確認します。'],
  ['回復が成功しても利益が下がる可能性はありますか？','あります。追加要員、残業、夜勤、機械、緊急輸送、監督、混雑による生産性低下、安全・品質リスクにより、工程上は成功しても商業的に不利になることがあります。回復は「時間」「増分コスト」「安全・品質リスク」「利益影響」を同時に評価します。'],
  ['ExcelとMicrosoft Projectの役割分担は何ですか？','ExcelはBOQ、数量、単価、出来高、Sカーブ、支払請求など数量・商務の管理権限を持ちます。Microsoft Projectは期間、ロジック、日付、トータルフロート、クリティカル判定、予測完了などCPM工程の管理権限を持ちます。共通IDで両者を照合します。'],
  ['なぜPDFだけでなくネイティブMPPを提出するのですか？','静的ガントは見た目が正しくてもロジック不良を隠せます。ネイティブMPPでは、先行関係、期間、日付、フロート、クリティカル状態、シナリオ差分をレビュー担当者自身が確認し、Microsoft Projectで再計算できます。'],
  ['これらの遅延は実際のChinaimo案件の遅延記録ですか？','いいえ。公開情報は案件背景の確認にのみ使用し、数量、単価、期間、ロジック、進捗、請求、遅延シナリオは技術評価用に独自作成したコントロールデータです。実際のKubota ConstructionまたはChinaimo案件の遅延記録として提示していません。']
];

export default function JapanesePage(){
  const currentClaim=assessment.boq.reduce((s,r)=>s+r.currentAmount,0);
  const previous=assessment.boq.reduce((s,r)=>s+r.previousAmount,0);
  const cumulative=assessment.boq.reduce((s,r)=>s+r.cumulativeAmount,0);
  const remaining=assessment.boq.reduce((s,r)=>s+r.remainingAmount,0);

  return <main id="top" lang="ja">
    <div className="projectChrome" aria-label="プロジェクトコントロール ワークスペース">
      <div className="projectTitleBar"><span className="projectAppMark">P</span><div><b>Project Controls Workspace</b><small>Chinaimo 技術評価 · Michael Futol</small></div><span className="projectState">日本語レビュー版</span></div>
      <div className="projectRibbon"><span>FILE</span><span>TASK</span><span>RESOURCE</span><span>REPORT</span><span>PROJECT</span><span>VIEW</span><b>工程管理権限: Microsoft Project</b></div>
    </div>

    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">MICHAEL FUTOL · プロジェクトコントロール技術評価</div>
        <h1>Chinaimo Project Controls</h1>
        <p className="heroLead">数量、進捗、工程、遅延、月次支払管理を一つの整合したコントロールモデルで示す技術評価パッケージ。</p>
        <div className="heroTags"><span>統合Project Controlsケース</span><span>Excel + Microsoft Project</span><span>共通WBS / Activity / BOQ ID</span><span>監査可能な根拠・管理構造</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">作業ファイル</div>
        <a className="primaryBtn" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · 進捗 · S-Curve · Claim</span></a>
        <div className="heroButtonRow"><a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_MSProject_Package.zip" download>MS Project Package (.zip)</a><a className="secondaryBtn" href="/downloads/Michael_Futol_Chinaimo_Technical_Assessment.pdf" download>印刷用PDF Pack</a></div>
        <a className="textLink" href="/">English version ↗</a>
      </div>
    </section>

    <nav className="navBar" aria-label="評価セクション">
      <a href="#start">概要</a><a href="#progress">進捗</a><a href="#boq">BOQ</a><a href="#schedule">工程</a><a href="#delays">遅延分析</a><a href="#claim">請求</a><a href="#controls">管理</a><a href="#reviewer-qa">Q&A</a><a href="#downloads">ファイル</a><a href="#sources">出典</a>
    </nav>

    <section className="notice"><b>日本語版について:</b> 本ページはレビューの便宜を目的とした日本語コンパニオンです。Activity ID、BOQ ID、ファイル名およびネイティブExcel / Microsoft Project記録は英語原本を技術上の管理記録とします。</section>
    <section className="notice"><b>評価範囲:</b> 公開情報は案件背景の確認にのみ使用しています。数量、単価、期間、ロジック、進捗、請求、遅延シナリオは技術評価用コントロールデータであり、実案件の内部記録を示すものではありません。</section>

    <section className="docControlBar" aria-label="文書管理"><div><small>DOCUMENT ID</small><b>{governance.documentControl.documentId}</b></div><div><small>REVISION</small><b>{governance.documentControl.revision}</b></div><div><small>STATUS</small><b>技術評価 / Illustrative</b></div><div><small>DATA DATE</small><b>{governance.documentControl.dataDate}</b></div><div><small>WORK CALENDAR</small><b>月〜土 8h/日 · 日曜休工</b></div></section>

    <section className="reviewPath" id="start"><div className="reviewStep"><span>01</span><div><b>現況確認</b><small>計画対実績・当月請求</small></div></div><div className="reviewStep"><span>02</span><div><b>工程確認</b><small>WBS・Gantt・Critical Path・Float</small></div></div><div className="reviewStep"><span>03</span><div><b>遅延テスト</b><small>Critical / Non-critical / Concurrent</small></div></div><div className="reviewStep"><span>04</span><div><b>請求照合</b><small>Previous + Current = Cumulative</small></div></div><div className="reviewStep"><span>05</span><div><b>ネイティブファイル確認</b><small>Excel + Microsoft Project</small></div></div></section>

    <section className="kpis"><Kpi label="公開情報上の概算契約金額" value={`¥${money(assessment.meta.controlValue)}`}/><Kpi label="データ日" value={assessment.meta.statusDate}/><Kpi label="計画進捗" value={pct(assessment.meta.plannedProgress)}/><Kpi label="実績進捗" value={pct(assessment.meta.actualProgress)}/><Kpi label="差異" value={`${assessment.meta.variance.toFixed(3)} pp`} bad/><Kpi label="ベースライン完了" value={assessment.meta.baselineFinish}/><Kpi label="当月総請求" value={`¥${money(assessment.meta.currentGrossClaim)}`}/><Kpi label="工程活動数" value={`${schedule.length}`}/></section>

    <section className="panel" id="progress"><div className="sectionHead"><div><span className="sectionNo">01 · 進捗管理</span><h2>計画対実績</h2><p>累積Sカーブ、差異、月次生産の視点で進捗を確認します。実績値はデータ日で終了し、それ以降は予測です。</p></div><span className="statusPill muted">INTERACTIVE</span></div><ProgressExplorer rows={assessment.progress} statusDate={assessment.meta.statusDate}/><div className="resultStrip"><div><small>DATA DATE 計画</small><b>{pct(assessment.meta.plannedProgress)}</b></div><div><small>DATA DATE 実績</small><b>{pct(assessment.meta.actualProgress)}</b></div><div><small>差異</small><b className="negative">{assessment.meta.variance.toFixed(3)} pp</b></div></div></section>

    <section className="panel" id="boq"><div className="sectionHead"><div><span className="sectionNo">02 · BOQ / 出来高計測</span><h2>請求につながる数量進捗</h2><p>同一の計測数量を出来高進捗と支払価値に使用します。説明名称は英語原本と一致させ、監査トレースを維持します。</p></div><a className="miniDownload" href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download>Excel原本を開く ↓</a></div><div className="tableScroll boqTable"><table><thead><tr><th>BOQ ID</th><th>説明（原本）</th><th>単位</th><th>契約数量</th><th>前回</th><th>当月</th><th>累計</th><th>残数量</th><th>進捗</th><th>当月金額</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{r.unit}</td><td>{qty(r.contractQty)}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td><span className="progressCell"><i style={{width:`${Math.min(100,r.progress*100)}%`}}/><b>{(r.progress*100).toFixed(1)}%</b></span></td><td>¥{money(r.currentAmount)}</td></tr>)}</tbody></table></div><div className="controlRule"><b>計測管理ルール</b><span>Previous + Current = Cumulative</span><span>Contract Qty − Cumulative = Remaining</span><span>Variation / remeasurementの根拠なしに累計数量がBOQ数量を超えないこと</span></div></section>

    <section className="panel" id="schedule"><div className="sectionHead"><div><span className="sectionNo">03 · 工程 / スケジュール管理</span><h2>Construction Programme & Scenario Explorer</h2><p>ベースラインと遅延シナリオはネイティブMicrosoft Projectと同じActivity IDを使用します。日付、フロート、クリティカル判定、予測完了はMicrosoft ProjectのCPM再計算を工程上の権限とします。</p></div><span className="criticalPill">MS PROJECT</span></div><ScheduleExplorer schedule={schedule} scenarios={assessment.scenarios} criticalPath={assessment.criticalPath} statusDate={assessment.meta.statusDate}/><details className="details"><summary>高度工程QA: 全{schedule.length}活動と依存関係を監査</summary><div className="tableScroll"><table><thead><tr><th>Activity ID</th><th>WBS</th><th>Activity（原本）</th><th>期間</th><th>Predecessor / Logic</th><th>Baseline Start</th><th>Baseline Finish</th><th>Critical</th></tr></thead><tbody>{schedule.map(a=><tr key={a.id} className={a.critical?'criticalRow':''}><td><code>{a.id}</code></td><td>{a.wbs}</td><td>{a.name}</td><td>{a.duration}d</td><td>{a.predecessors||'—'} {a.relationships}</td><td>{a.baselineStart}</td><td>{a.baselineFinish}</td><td>{a.critical?'YES':'NO'}</td></tr>)}</tbody></table></div></details></section>

    <section className="panel" id="delays"><div className="sectionHead"><div><span className="sectionNo">04 · 遅延影響</span><h2>シナリオ結果と管理判断</h2><p>先に結果を示し、その後に理由と管理対応を示します。活動の遅延日数は自動的にプロジェクト遅延日数にはなりません。</p></div></div><div className="scenarioGrid">{assessment.scenarios.map(s=>{const j=scenarioJa[s.id]||scenarioJa.A;return <article className="scenario" key={s.id}><div className="scenarioTop"><span>SCENARIO {s.id}</span><b className={s.netImpact>0?'impactBad':'impactOk'}>{s.netImpact>0?`+${s.netImpact} wd`:'0 wd'}</b></div><h3>{j.name}</h3><p className="activityName">{s.activity}</p><div className="scenarioDates"><div><small>BASELINE</small><b>{s.baselineFinish}</b></div><div><small>FORECAST</small><b>{s.forecastFinish}</b></div></div><div className="solutionBox"><small>工程影響</small><strong>{j.effect}</strong></div><details><summary>理由 / 判断根拠</summary><p>{j.why}</p></details></article>})}</div><div className="commentaryRule"><b>報告原則</b><span><strong>Fact</strong> — 何が変わったか</span><span><strong>Implication</strong> — 何に影響するか</span><span><strong>Action</strong> — 次に何を守る・回復する・監視するか</span></div></section>

    <section className="panel" id="claim"><div className="sectionHead"><div><span className="sectionNo">05 · 月次請求</span><h2>Payment Claim Reconciliation</h2><p>請求数量と実績進捗に使用する数量を一致させ、Previous + Current = Cumulativeを照合します。</p></div><span className="statusPill">BOQ-CHECKED</span></div><div className="claimKpis"><Kpi label="前回累計出来高" value={`¥${money(previous)}`}/><Kpi label="当月出来高" value={`¥${money(currentClaim)}`}/><Kpi label="累計出来高" value={`¥${money(cumulative)}`}/><Kpi label="残高" value={`¥${money(remaining)}`}/></div><div className="tableScroll"><table><thead><tr><th>BOQ ID</th><th>説明（原本）</th><th>Previous Qty</th><th>Current Qty</th><th>Cumulative</th><th>Remaining</th><th>当月金額</th><th>QA</th></tr></thead><tbody>{assessment.boq.map(r=><tr key={r.id}><td><code>{r.id}</code></td><td>{r.description}</td><td>{qty(r.previousQty)}</td><td>{qty(r.currentQty)}</td><td>{qty(r.cumulativeQty)}</td><td>{qty(r.balanceQty)}</td><td>¥{money(r.currentAmount)}</td><td><span className="qaOk">MATCH</span></td></tr>)}</tbody></table></div></section>

    <section className="panel" id="controls"><div className="sectionHead"><div><span className="sectionNo">06 · マネジメントシステム管理</span><h2>ISO整合型の管理構造</h2><p>Kubota Constructionが公開しているISO 14001、ISO 9001、ISO 45001の認証情報を踏まえ、互換性のある管理概念を採用しています。ただし本評価はKubota社内手順への適合を主張するものではありません。</p></div><span className="statusPill muted">CONTROLLED</span></div><div className="doctrineCard"><div><small>PROJECT CONTROLS DOCTRINE</small><h3>一つの管理モデル、保存されたベースライン、追跡可能な計測、見た目より工程ロジック、そして Fact → Implication → Action による冷静なマネジメント報告。</h3></div></div><div className="isoGrid"><article><span>ISO 9001</span><h3>品質マネジメント</h3><p>Document ID / revision / status、共通ID、計測照合、ベースライン・変更履歴、レビュー証跡。</p></article><article><span>ISO 14001</span><h3>環境マネジメント</h3><p>環境・許認可制約を工程インターフェース／ホールドポイントとして登録し、責任者・日付・証拠を活動へ紐づけます。</p></article><article><span>ISO 45001</span><h3>労働安全衛生</h3><p>安全許可、Method Statement、前提条件をreadiness gateとして扱い、工程短縮のために必要な安全管理を迂回しません。</p></article></div><div className="authorityGrid"><div><span className="authorityTool">EXCEL</span><b>数量 / 商務の管理権限</b><p>BOQ、数量、単価、出来高、S-Curve、支払請求。</p></div><div><span className="authorityTool">MS PROJECT</span><b>工程 / CPMの管理権限</b><p>期間、ロジック、Start/Finish、Total Slack、Critical、Forecast Finish。</p></div><div><span className="authorityTool">WEB / PDF</span><b>レビュー表示層</b><p><code>WBS_ID</code>、<code>ACTIVITY_ID</code>、<code>BOQ_ID</code>を通じて照合済み結果を表示します。</p></div></div></section>

    <section className="panel" id="reviewer-qa"><div className="sectionHead"><div><span className="sectionNo">07 · レビューQ&A</span><h2>工程・遅延・回復</h2><p>レビュー担当者またはPMから想定される質問に対し、モデル上の事実、意味、管理対応を区別して回答します。</p></div><span className="statusPill muted">DEFENCE NOTES</span></div><div className="commentaryRule"><b>回答原則</b><span><strong>Fact</strong> — モデルが示すこと</span><span><strong>Implication</strong> — その意味</span><span><strong>Action</strong> — 次の管理行動</span></div>{faq.map((item,index)=><details className="details" key={item[0]} open={index<3}><summary>{String(index+1).padStart(2,'0')} · {item[0]}</summary><p>{item[1]}</p></details>)}</section>

    <section className="panel downloads" id="downloads"><div className="downloadIntro"><span className="sectionNo">08 · 作業ファイル</span><h2>実際の作業ファイルを確認</h2><p>Webは統合コントロールモデルのレビュー表示です。ExcelとMicrosoft Projectのネイティブファイルを技術上の作業記録として保持します。</p></div><div className="downloadGrid"><a href="/downloads/Michael_Futol_Chinaimo_Project_Controls.xlsx" download><b>Excel Project Controls Workbook</b><span>.xlsx · BOQ · Measurement · Progress · Gantt · S-Curve · Claim · Delay Analysis</span><em>DOWNLOAD ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_Technical_Assessment.pdf" download><b>Printable Assessment Pack</b><span>PDF · status · BOQ/progress · schedule evidence · delay commentary · sources</span><em>DOWNLOAD PDF ↓</em></a><a href="/downloads/Michael_Futol_Chinaimo_MSProject_Package.zip" download><b>Complete Microsoft Project Package</b><span>Baseline / delay scenarios / recovery evidenceを含むネイティブMPPパッケージ。</span><em>DOWNLOAD ZIP ↓</em></a><a href="https://github.com/michaelfutol/Michael-Futol-Chinaimo-Project-Controls" target="_blank"><b>GitHub Audit Trail</b><span>Source data · Schedule data · Governance · Revision history</span><em>INSPECT ↗</em></a></div></section>

    <section className="panel" id="sources"><div className="sectionHead"><div><span className="sectionNo">09 · 出典・機密性</span><h2>公開情報と技術評価データの境界</h2><p>公開情報から得た案件背景と、独自作成した評価用コントロールデータを明確に分離します。</p></div></div><div className="boundaryGrid"><div><b>公開情報に基づく案件背景</b><p>案件名称、施設の大枠・容量、公開されている工期・概算契約金額、公開処理プロセス情報のみ。</p></div><div><b>評価用に独自作成した管理モデル</b><p>WBS、活動期間・依存関係、作業カレンダー、BOQ数量、単価、月次進捗、請求値、回復ロジック、遅延シナリオ。</p></div></div><div className="confidentialityBox"><b>機密性の境界</b><span>Kubota Constructionの機密工程、BOQ、単価、請求、入札情報、社内手順をソースデータとして使用していません。</span></div><h3 className="subHeading">公開情報</h3><div className="factGrid">{governance.publicFacts.map(f=><a href={f.sourceUrl} target="_blank" key={`${f.fact}-${f.value}`}><small>Public project fact</small><b>{f.value}</b><span>{f.sourceLabel} ↗</span></a>)}</div><h3 className="subHeading">Source Register</h3><div className="sourceGrid">{governance.sourceRegister.map(s=><a href={s.url} target="_blank" key={s.url}><b>{s.label}</b><span>{s.use}</span><small>公開ソースを開く ↗</small></a>)}</div></section>

    <footer><div><b>Michael Futol</b><span>Project Controls & Construction Planning Technical Assessment · 日本語レビュー版</span></div><a href="#top">ページ上部へ ↑</a></footer>
  </main>
}

function Kpi({label,value,bad=false}:{label:string,value:string,bad?:boolean}){return <div className="kpi"><small>{label}</small><b className={bad?'negative':''}>{value}</b></div>}
