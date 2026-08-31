import type { Metadata } from 'next';
import styles from '../page.module.css';

export const metadata: Metadata = {
  title: 'Michael Futol - チャイナイモ・プロジェクト工程リカバリー評価',
  description: 'チャイナイモ・プロジェクトコントロール技術評価資料'
};

export default function JapaneseDossier(){
  return <main className={styles.page}>
    <article className={styles.paper}>
      <header className={styles.header}>
        <p className={styles.name}>MICHAEL FUTOL · PROJECT CONTROLS DOSSIER / CHINAIMO</p>
        <h1 className={styles.title}>チャイナイモ・プロジェクト工程リカバリー評価</h1>
        <p className={styles.purpose}>目的：ベースライン、実績予測、部分リカバリー、進捗・支払管理の考え方を、評価用データとして簡潔かつ監査可能な形で提示する。</p>
        <div className={styles.metaLine}><span>データ基準日：2026年8月31日</span><span>Native Microsoft Project CPM：QA PASS</span></div>
      </header>

      <section className={styles.section}>
        <h2>プロジェクト情報</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}><span>公開施工開始</span><strong>2025年10月</strong></div>
          <div className={styles.infoRow}><span>公開工期</span><strong>30ヶ月</strong></div>
          <div className={styles.infoRow}><span>公開進捗チェックポイント</span><strong>4.19% · 2026年5月5日</strong></div>
          <div className={styles.infoRow}><span>評価進捗率</span><strong>12.095% · 評価シミュレーション</strong></div>
          <div className={styles.infoRow}><span>公開完成目標</span><strong>2028年7月</strong></div>
          <div className={styles.infoRow}><span>評価用予算管理額</span><strong>JPY 6,000,000,000</strong></div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>3モデル工程管理</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>モデル</th><th>予測完了</th><th>差異 / 回収</th><th>管理目的</th></tr></thead>
            <tbody>
              <tr><td>ベースライン Rev 0</td><td><strong>15-Feb-2028</strong></td><td>0 wd</td><td>評価用基準。履歴として凍結・保存。</td></tr>
              <tr><td>実績予測 / Current Forecast</td><td><strong>23-Jun-2028</strong></td><td><strong>+111 wd</strong></td><td>31-Aug-2026 時点の Native CPM forecast。</td></tr>
              <tr><td>部分リカバリー</td><td><strong>14-Apr-2028</strong></td><td><strong>60 wd 回収 / 51 wd 残存</strong></td><td>施工性・QA/QC・HSE・調達・リソースの現場検証を前提。</td></tr>
            </tbody>
          </table>
        </div>
        <p className={styles.sectionIntro} style={{marginTop:18}}>2028年7月は公開完成目標であり、Native CPM の Current Forecast を強制する日付ではありません。</p>
      </section>

      <section className={styles.section}>
        <h2>管理原則</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}><span>ベースライン</span><strong>Rev 0 は上書きしない</strong></div>
          <div className={styles.infoRow}><span>月次更新</span><strong>実績と残作業予測を更新</strong></div>
          <div className={styles.infoRow}><span>改訂ベースライン</span><strong>正式承認時のみ Rev n を発行</strong></div>
          <div className={styles.infoRow}><span>進捗率</span><strong>BOQ / Value と Schedule % を区別</strong></div>
          <div className={styles.infoRow}><span>Recovery</span><strong>数字だけでなく施工可能性を検証</strong></div>
          <div className={styles.infoRow}><span>Authority</span><strong>工程・CPM は Native MPP が基準</strong></div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Commercial / Sample IPC</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}><span>累積評価進捗</span><strong>12.095%</strong></div>
          <div className={styles.infoRow}><span>今回進捗率</span><strong>2.595%</strong></div>
          <div className={styles.infoRow}><span>今回総出来高</span><strong>JPY 155,700,000</strong></div>
          <div className={styles.infoRow}><span>Sample IPC 純支払額</span><strong>JPY 140,130,000</strong></div>
        </div>
        <p className={styles.sectionIntro} style={{marginTop:18}}>Retention、Advance Recovery、税、認定条件は実際の Contract Particular Conditions を優先する。</p>
      </section>

      <section className={styles.section}>
        <h2>実プロジェクトへの移行</h2>
        <p className={styles.purpose}>採用後は、この評価用シミュレーションを Kubota の承認済工程、実績数量、調達状況、現場生産性、変更記録へ置き換え、再現可能な月次 Project Controls サイクルへ移行する。</p>
      </section>

      <footer className={styles.footer}><strong>Michael Futol</strong> · Chinaimo Project Controls Technical Assessment · 31-Aug-2026</footer>
    </article>
  </main>
}
