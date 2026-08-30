export default function DecisionSimulatorJaPage(){
  return <main id="top" style={{maxWidth:1180,margin:'0 auto',padding:'88px 24px 48px'}}>
    <section className="hero" style={{marginBottom:24}}>
      <div className="heroCopy">
        <div className="eyebrow">ボーナスコンセプト · 将来のプロジェクトコントロール拡張案</div>
        <h1>AI支援型プロジェクト意思決定シミュレータ</h1>
        <p className="heroLead">実際の工事計画を変更する前に、その影響をデジタル上で先に検証する。</p>
        <div className="heroTags"><span>アクティビティ単位のリスク分解</span><span>CPMシミュレーション</span><span>QUBO / MILP / CP-SAT 最適化</span><span>人による承認</span></div>
      </div>
      <div className="heroAction">
        <div className="deliverableLabel">コンセプトの位置付け</div>
        <div className="notice" style={{margin:0}}><b>将来構想です。</b> 本ページは、検証済みのChinaimo工程計算そのものではなく、提出済みの回復工程をQUBOまたはAI最適化で作成したと主張するものでもありません。</div>
        <div className="heroButtonRow"><a className="secondaryBtn" href="/ja">評価資料へ戻る</a><a className="secondaryBtn" href="/decision-simulator">ENGLISH</a></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">01 · 課題</span><h2>ガントチャート上の変更は簡単でも、現場での回復は簡単ではない。</h2><p>大規模なWBSには数百、数千のアクティビティが含まれます。各アクティビティは、図面、材料、作業場所、作業員、機械、許可、RFI、QAホールドポイント、HSE管理、天候、調達、サブコン間インターフェースなどに依存します。これら全ての組合せを、一人の人間が継続的に詳細分析することは現実的ではありません。</p></div></div>
      <div className="authorityGrid">
        <div><span className="authorityTool">ACTIVITY</span><b>Activity Control Passport</b><p>前提条件 → 図面 → 材料 → 作業場所 → 人員 / 機械 → 生産性 → QA/QC → HSE → インターフェース → リスク → コスト → フロート → 後続影響 → 回復案。</p></div>
        <div><span className="authorityTool">QUESTION</span><b>何が実現すれば短縮できるのか。</b><p>単に「5日短縮」と入力するのではなく、その5日を実際に回復するために必要な技術条件、資源条件、組織条件を明確にします。</p></div>
        <div><span className="authorityTool">OUTPUT</span><b>意思決定可能な選択肢</b><p>各対策について、日数効果、追加コスト、混雑、疲労、HSEリスク、QA負荷、資源需要、調達依存、新たなクリティカルパス発生リスクを評価します。</p></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">02 · 先にシミュレーション</span><h2>実行を決める前に、その結果を検証する。</h2><p>第2班の投入、追加作業場所、残業、夜間作業、ゾーン別引渡し、プレファブ化、リシーケンス、選択的な工程重複、機械変更、調達の迅速化などの候補を作成し、CPM・コスト・リスクの観点から組合せの影響を検証します。</p></div></div>
      <div className="commentaryRule"><b>例となる問い</b><span>Zone 2を5日早く開放したらどうなるか。</span><span>調達が7日遅れたらどうなるか。</span><span>残業で理論能力が上がっても、混雑で生産性が落ちたらどうなるか。</span><span>回復策によって別の経路がクリティカルにならないか。</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">03 · 意思決定エンジン</span><h2>最適化は、実行可能と定義された選択肢の中を探索する。</h2><p>QUBOは、班を追加するか、シフトを追加するか、作業場所を増やすか、工程を重複させるか、調達を迅速化するか、といった離散的な選択肢が多数ある場合に有効になり得ます。ただし、QUBOは複数ある最適化手法の一つであり、工学的判断そのものではありません。</p></div></div>
      <div className="resultStrip"><div><small>目的</small><b>回復コスト + 遅延影響 + 安全 / 品質 / 資源ペナルティを最小化</b></div><div><small>制約</small><b>予測完了日 ≤ 要求完了日</b></div><div><small>ソルバー比較</small><b>QUBO · MILP · CP-SAT · ヒューリスティクス</b></div></div>
      <div className="controlRule"><b>ソルバー中立の原則</b><span>特定技術ではなく、最も良い実行可能解を採用する。</span><span>工学・施工ルールが許容範囲を決める。</span><span>最適化は、その許容範囲内を探索する。</span></div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">04 · ガバナンス</span><h2>Human-in-command のワークフロー</h2><p>モデルは候補を提示し検証します。プロジェクトチームが実行可能性を確認し、Project Manager が承認します。</p></div></div>
      <div className="reviewPath" style={{gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
        <div className="reviewStep"><span>01</span><div><b>工学・施工ルール</b><small>物理的、技術的、契約上の実行可能性を定義。</small></div></div>
        <div className="reviewStep"><span>02</span><div><b>AIによる分解</b><small>依存関係、リスク、候補対策を抽出。</small></div></div>
        <div className="reviewStep"><span>03</span><div><b>CPM + シミュレーション + 最適化</b><small>時間、コスト、資源、リスクの影響を検証。</small></div></div>
        <div className="reviewStep"><span>04</span><div><b>部門横断検証・PM承認</b><small>Construction · Engineering · Procurement · QA/QC · HSE · Commercial。</small></div></div>
      </div>
    </section>

    <section className="panel">
      <div className="sectionHead"><div><span className="sectionNo">05 · 原則</span><h2>QUBOは戦略探索の手段であり、エンジニアそのものではない。</h2></div></div>
      <div className="doctrineCard"><div><small>PROJECT DECISION SIMULATOR</small><h3>工程表は、どこに介入が必要かを示す。Engineering と Construction は、何が実際に実行可能かを定義する。シミュレーションは影響を検証し、最適化は最良の実行可能な組合せを探索する。最終的な意思決定責任は、プロジェクトチームに残る。</h3></div></div>
      <p className="controlNote" style={{marginTop:18}}><b>目標：</b> 単に日数を取り戻すことではなく、完了日、品質、プロジェクト利益を守るための、安全で経済的かつ現場で実行可能な方法を選ぶこと。</p>
      <p className="controlNote"><b>翻訳注記：</b> 日本語ページはレビュー支援用です。技術的・契約的な解釈に差異がある場合は、英語版およびネイティブ提出ファイルを基準とします。</p>
    </section>

    <footer><div><b>Michael Futol</b><span>Project Controls & Construction Planning Technical Assessment · 将来構想</span></div><a href="/ja">評価資料へ戻る ↑</a></footer>
  </main>
}
