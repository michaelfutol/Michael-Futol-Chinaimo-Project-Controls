import Link from 'next/link';
import { notFound } from 'next/navigation';

const PROD_ORIGIN = 'https://michael-futol-chinaimo-project-cont.vercel.app';

const files = {
  'master-excel': {
    title: 'Final Master Excel',
    jp: '最終マスター Excel',
    format: 'Microsoft Excel Workbook (.xlsx)',
    role: 'Quantity / commercial control authority',
    kind: 'excel',
    description: 'Reconciled project-controls workbook containing the core assessment data, BOQ/value controls, progress information, and supporting project-controls schedules used by the submission.',
    href: '/downloads/Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx',
    filename: 'Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx',
  },
  'reviewer-companion': {
    title: 'English Reviewer Companion',
    jp: '英語版レビュー資料',
    format: 'Microsoft Word Document (.docx)',
    role: 'Reviewer narrative / assessment companion',
    kind: 'word',
    description: 'Concise English companion explaining the project-controls approach, assumptions, governance, and reviewer context supporting the native schedule and Excel evidence.',
    href: '/downloads/CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx',
    filename: 'CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx',
  },
  'schedule-annex': {
    title: 'Schedule Logic & S-Curve Annex',
    jp: '工程ロジック・Sカーブ付属資料',
    format: 'Microsoft Excel Workbook (.xlsx)',
    role: 'Schedule logic / predecessor / progress annex',
    kind: 'excel',
    description: 'Dedicated annex for predecessor relationships, schedule logic, monthly progress control, and S-Curve data. It supports the native Microsoft Project CPM models without replacing them as the schedule authority.',
    href: '/downloads/Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx',
    filename: 'Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx',
  },
} as const;

type FileSlug = keyof typeof files;

const buttonStyle = {
  display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:44,padding:'9px 16px',
  border:'1px solid #9da3a1',color:'#344249',textDecoration:'none',
  font:'700 11px/1.2 Courier New,monospace',letterSpacing:'.035em',textTransform:'uppercase' as const,
};

export default async function ReviewFilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = files[slug as FileSlug];
  if (!file) notFound();

  const publicFileUrl = `${PROD_ORIGIN}${file.href}`;
  const encoded = encodeURIComponent(publicFileUrl);
  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}&wdAllowInteractivity=True`;
  const fullViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encoded}`;
  const viewerHint = file.kind === 'excel'
    ? 'Browse the workbook directly below. Worksheet tabs are available in the Excel web viewer, so the workbook can be reviewed without Microsoft Excel installed.'
    : 'Read and scroll the Word companion directly below. The document can be reviewed without Microsoft Word installed.';

  return (
    <main style={{minHeight:'100vh',background:'#eeeee9',padding:'26px 16px 38px',color:'#283238',fontFamily:"Arial,'Helvetica Neue','Noto Sans JP',sans-serif"}}>
      <article style={{maxWidth:1420,margin:'0 auto',background:'#fbfaf7',border:'1px solid #b9bdb9',boxShadow:'0 6px 22px rgba(35,42,45,.05)'}}>
        <header style={{padding:'28px 34px 23px',borderTop:'4px solid #293a42',borderBottom:'1px solid #b9bdb9'}}>
          <p style={{margin:'0 0 8px',color:'#8e4539',font:'700 11px/1.3 Courier New,monospace',letterSpacing:'.12em'}}>IN-BROWSER DOCUMENT REVIEW / ブラウザ閲覧</p>
          <h1 style={{margin:0,fontSize:40,lineHeight:1.08,color:'#25353c',fontFamily:"Bodoni 72,Didot,Bodoni MT,Baskerville,Times New Roman,serif",fontWeight:600}}>{file.title}</h1>
          <p lang="ja" style={{margin:'7px 0 0',fontSize:14,color:'#73797b',letterSpacing:'.05em'}}>{file.jp}</p>
          <p style={{margin:'15px 0 0',fontSize:15,lineHeight:1.65,color:'#596267'}}>{file.description}</p>
        </header>

        <section style={{padding:'18px 20px 28px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:10}}>
            <div style={{font:'700 11px/1.35 Courier New,monospace',letterSpacing:'.05em',color:'#536066'}}>
              {file.kind === 'excel' ? 'LIVE WORKBOOK VIEW · SHEET TABS ENABLED' : 'LIVE WORD DOCUMENT VIEW'}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
              <a href={fullViewerUrl} target="_blank" rel="noreferrer" style={buttonStyle}>Open Viewer Full</a>
              <a href={file.href} style={{...buttonStyle,borderColor:'#2b3d45',background:'#2b3d45',color:'#fbfaf7'}}>Download Original</a>
              <Link href="/" style={buttonStyle}>Return to Assessment</Link>
            </div>
          </div>

          <div style={{padding:'10px 12px',marginBottom:10,borderLeft:'3px solid #7e9478',background:'#f3f5ef',fontSize:13.5,lineHeight:1.55,color:'#56605a'}}>
            {viewerHint}
          </div>

          <div style={{height:'82vh',minHeight:720,maxHeight:1120,border:'1px solid #aeb3b1',background:'#fff',overflow:'hidden'}}>
            <iframe
              src={embedUrl}
              title={`${file.title} in-browser Office viewer`}
              style={{width:'100%',height:'100%',border:0,display:'block',background:'#fff'}}
              allowFullScreen
            />
          </div>

          <details style={{marginTop:14,border:'1px solid #c8cbc7',background:'#f8f8f5'}}>
            <summary style={{cursor:'pointer',padding:'11px 13px',font:'700 11px/1.3 Courier New,monospace',letterSpacing:'.05em',color:'#435158'}}>FILE CONTROL DETAILS</summary>
            <div style={{display:'grid',gridTemplateColumns:'minmax(130px,180px) 1fr',fontSize:14,borderTop:'1px solid #d4d6d2'}}>
              <div style={{padding:'10px 12px',background:'#f0f0ec',borderBottom:'1px solid #d5d6d1',fontWeight:700}}>Format</div>
              <div style={{padding:'10px 12px',borderBottom:'1px solid #d5d6d1'}}>{file.format}</div>
              <div style={{padding:'10px 12px',background:'#f0f0ec',borderBottom:'1px solid #d5d6d1',fontWeight:700}}>Control role</div>
              <div style={{padding:'10px 12px',borderBottom:'1px solid #d5d6d1'}}>{file.role}</div>
              <div style={{padding:'10px 12px',background:'#f0f0ec',fontWeight:700}}>File name</div>
              <div style={{padding:'10px 12px',font:'12px/1.5 Courier New,monospace',overflowWrap:'anywhere'}}>{file.filename}</div>
            </div>
          </details>
        </section>
      </article>
    </main>
  );
}
