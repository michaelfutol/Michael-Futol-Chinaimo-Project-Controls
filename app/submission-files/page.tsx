export default function SubmissionFilesPage(){
  return <main className="page-shell" style={{maxWidth:'980px',margin:'48px auto',padding:'0 24px'}}>
    <p className="eyebrow">SUBMISSION FILE INTEGRITY</p>
    <h1>Native Office files are issued with the formal application package</h1>
    <p>The audited Excel workbook and the English and Japanese Word reviewer documents are supplied as the formal application attachments. This preserves the exact certified native binaries rather than serving an unverified web copy.</p>
    <p>The website remains the reviewer-facing presentation layer. Excel remains the quantity/commercial authority; Microsoft Project remains the schedule/CPM authority.</p>
    <div className="notice" style={{marginTop:'24px'}}>
      <b>Primary schedule-control structure:</b> Baseline Programme → Running / Current Schedule with actual status → Recovery Programme. The delay scenarios are supporting CPM analysis evidence, not separate primary programmes.
    </div>
    <div className="notice" style={{marginTop:'16px'}}>
      <b>Reviewer note:</b> Please use the Excel and Word files attached to the application email/submission package. The certified Microsoft Project evidence package remains available below.
    </div>
    <p style={{marginTop:'28px'}}><a className="button" href="/downloads/Michael_Futol_Chinaimo_MSProject_Package.zip">Download certified MS Project package</a></p>
    <p><a href="/">← Return to English assessment</a> · <a href="/ja">日本語ページ</a></p>
    <hr style={{margin:'40px 0 28px'}} />
    <h2>日本語</h2>
    <p>監査済みの Excel ワークブック、英語版 Word 文書、日本語レビュー用 Word 文書は、完全性を保つため正式な応募添付ファイルとして提出されています。ウェブサイトはレビュー用のプレゼンテーション層です。Excel は数量・商務管理の基準、Microsoft Project は工程・CPM の基準です。</p>
    <p><b>主要な工程管理構成:</b> Baseline Programme → 実績を反映した Running / Current Schedule → Recovery Programme。遅延シナリオはCPM分析の補足証拠であり、主要工程表とは位置付けません。</p>
  </main>;
}
