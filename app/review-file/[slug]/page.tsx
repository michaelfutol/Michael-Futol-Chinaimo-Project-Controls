import Link from 'next/link';
import { notFound } from 'next/navigation';

const files = {
  'master-excel': {
    title: 'Final Master Excel',
    jp: '最終マスター Excel',
    format: 'Microsoft Excel Workbook (.xlsx)',
    role: 'Quantity / commercial control authority',
    description: 'Reconciled project-controls workbook containing the core assessment data, BOQ/value controls, progress information, and supporting project-controls schedules used by the submission.',
    href: '/downloads/Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx',
    filename: 'Michael_Futol_Chinaimo_Project_Controls_FINAL_BEAUTIFIED_NATIVE_CPM_2026-08-31.xlsx',
  },
  'reviewer-companion': {
    title: 'English Reviewer Companion',
    jp: '英語版レビュー資料',
    format: 'Microsoft Word Document (.docx)',
    role: 'Reviewer narrative / assessment companion',
    description: 'Concise English companion explaining the project-controls approach, assumptions, governance, and reviewer context supporting the native schedule and Excel evidence.',
    href: '/downloads/CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx',
    filename: 'CHINAIMO_PROJECT_CONTROLS_REVIEWER_COMPANION_EN_FINAL_NATIVE_CPM_2026-08-31.docx',
  },
  'schedule-annex': {
    title: 'Schedule Logic & S-Curve Annex',
    jp: '工程ロジック・Sカーブ付属資料',
    format: 'Microsoft Excel Workbook (.xlsx)',
    role: 'Schedule logic / predecessor / progress annex',
    description: 'Dedicated annex for predecessor relationships, schedule logic, monthly progress control, and S-Curve data. It supports the native Microsoft Project CPM models without replacing them as the schedule authority.',
    href: '/downloads/Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx',
    filename: 'Michael_Futol_Chinaimo_Schedule_Logic_Progress_SCurve_ANNEX_FINAL_2026-08-31.xlsx',
  },
} as const;

type FileSlug = keyof typeof files;

export default async function ReviewFilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = files[slug as FileSlug];
  if (!file) notFound();

  return (
    <main style={{minHeight:'100vh',background:'#eeeee9',padding:'34px 18px',color:'#283238',fontFamily:"Arial,'Helvetica Neue','Noto Sans JP',sans-serif"}}>
      <article style={{maxWidth:920,margin:'0 auto',background:'#fbfaf7',border:'1px solid #b9bdb9',boxShadow:'0 6px 22px rgba(35,42,45,.05)'}}>
        <header style={{padding:'34px 42px 28px',borderTop:'4px solid #293a42',borderBottom:'1px solid #b9bdb9'}}>
          <p style={{margin:'0 0 9px',color:'#8e4539',font:'700 11px/1.3 Courier New,monospace',letterSpacing:'.12em'}}>DOCUMENT REVIEW / ダウンロード確認</p>
          <h1 style={{margin:0,fontSize:38,lineHeight:1.12,color:'#25353c'}}>{file.title}</h1>
          <p lang="ja" style={{margin:'7px 0 0',fontSize:14,color:'#73797b',letterSpacing:'.05em'}}>{file.jp}</p>
        </header>

        <section style={{padding:'30px 42px 36px'}}>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr',border:'1px solid #c8cbc7',fontSize:15}}>
            <div style={{padding:'12px 14px',background:'#f0f0ec',borderBottom:'1px solid #d5d6d1',fontWeight:700}}>Format</div>
            <div style={{padding:'12px 14px',borderBottom:'1px solid #d5d6d1'}}>{file.format}</div>
            <div style={{padding:'12px 14px',background:'#f0f0ec',borderBottom:'1px solid #d5d6d1',fontWeight:700}}>Control role</div>
            <div style={{padding:'12px 14px',borderBottom:'1px solid #d5d6d1'}}>{file.role}</div>
            <div style={{padding:'12px 14px',background:'#f0f0ec',fontWeight:700}}>File name</div>
            <div style={{padding:'12px 14px',font:'12px/1.5 Courier New,monospace',overflowWrap:'anywhere'}}>{file.filename}</div>
          </div>

          <p style={{margin:'24px 0 0',fontSize:16,lineHeight:1.7,color:'#555e62'}}>{file.description}</p>
          <div style={{marginTop:22,padding:'14px 16px',borderLeft:'3px solid #7e9478',background:'#f5f6f1',fontSize:14,lineHeight:1.6,color:'#56605a'}}>
            This page is intentionally shown before download so the reviewer can confirm the file role and format. The original Office file is downloaded only after the button below is selected.
          </div>

          <div style={{display:'flex',flexWrap:'wrap',gap:9,marginTop:28}}>
            <a href={file.href} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:46,padding:'10px 18px',border:'1px solid #2b3d45',background:'#2b3d45',color:'#fbfaf7',textDecoration:'none',font:'700 12px/1.2 Courier New,monospace',letterSpacing:'.035em',textTransform:'uppercase'}}>Download Original File</a>
            <Link href="/" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:46,padding:'10px 18px',border:'1px solid #9da3a1',color:'#344249',textDecoration:'none',font:'700 12px/1.2 Courier New,monospace',letterSpacing:'.035em',textTransform:'uppercase'}}>Return to Assessment</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
