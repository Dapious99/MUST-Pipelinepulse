import { useMemo, useState } from 'react';
import { analyze, type Candidate } from '../features/stall-analysis/analysis';
import { parseCandidates, downloadFlagsCsv } from '../lib/csv';
import { Header } from '../components/Header';
import { ImportPanel, type ImportStatus } from '../components/ImportPanel';
import { AnalysisSettings } from '../components/AnalysisSettings';
import { StatsCards } from '../components/StatsCards';
import { CandidateTable } from '../components/CandidateTable';
function todayUTC(){return new Date().toISOString().slice(0,10);}
export function DashboardPage(){
 const [candidates,setCandidates]=useState<Candidate[]>([]),[errors,setErrors]=useState<string[]>([]);
 const [threshold,setThreshold]=useState(7),[date,setDate]=useState(todayUTC()),[query,setQuery]=useState(''),[priority,setPriority]=useState('All');
 const [view,setView]=useState<'stalled'|'all'>('stalled'),[filename,setFilename]=useState('');
 const [stage,setStage]=useState('All'),[owner,setOwner]=useState('All');
 const [importStatus,setImportStatus]=useState<ImportStatus>({state:'idle',message:''});
 const flags=useMemo(()=>analyze(candidates,threshold,date),[candidates,threshold,date]);
 const visible=flags.filter(f=>(priority==='All'||f.priority===priority)&&[f.name,f.role,f.stage,f.owner].some(s=>s.toLowerCase().includes(query.toLowerCase())));
 async function processFile(file:File){
  setImportStatus({state:'loading',message:`Processing ${file.name}…`});
  // Yield to the browser so the loading indicator is visible before parsing begins.
  await new Promise<void>(resolve=>setTimeout(resolve,40));
  try {
   if (!/\.csv$/i.test(file.name)) throw new Error('Please select a .csv file.');
   if (file.size===0) throw new Error('This CSV is empty. Choose a file with candidate records.');
   const result=await parseCandidates(file,date);
   if (!result.candidates.length) throw new Error(result.errors[0]||'No valid candidates found in this CSV.');
   setFilename(file.name);setCandidates(result.candidates);setErrors(result.errors);
   setView('stalled');setPriority('All');setStage('All');setOwner('All');setQuery('');
   setImportStatus({state:'success',message:`${result.candidates.length} candidate${result.candidates.length===1?'':'s'} imported${result.errors.length?` with ${result.errors.length} issue(s) to review`: ' successfully'}.`,count:result.candidates.length,rejected:result.errors.length});
  } catch(e) {
   const message=e instanceof Error?e.message:'Could not read CSV';
   setImportStatus({state:'error',message});
   // Preserve previously imported candidates if a new file is invalid.
  }
 }
 async function loadSample(){
  setImportStatus({state:'loading',message:'Loading sample candidate data…'});
  try {const response=await fetch('/sample-candidates.csv');if(!response.ok)throw new Error('Sample CSV could not be loaded.');const blob=await response.blob();await processFile(new File([blob],'sample-candidates.csv',{type:'text/csv'}));}
  catch(e){setImportStatus({state:'error',message:e instanceof Error?e.message:'Could not load sample'});}
 }
 return <div className="min-h-screen bg-slate-50 text-slate-800"><Header/><main className="mx-auto max-w-7xl space-y-7 px-5 py-9"><div><p className="text-sm font-semibold text-teal-700">RECRUITING OPERATIONS</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Keep your hiring pipeline moving.</h2><p className="mt-2 text-slate-500">Find stalled candidates, understand why they're flagged, and prioritize the next follow-up.</p></div>
 <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]"><ImportPanel filename={filename} status={importStatus} onUpload={processFile} onSample={loadSample}/><AnalysisSettings threshold={threshold} date={date} onThreshold={setThreshold} onDate={setDate}/></section>
 {errors.length>0&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-900">{errors.length} import issue(s)</h3><ul className="mt-2 list-disc pl-5 text-sm text-amber-900">{errors.slice(0,12).map((e,i)=><li key={i}>{e}</li>)}</ul>{errors.length>12&&<p className="mt-2 text-sm">And {errors.length-12} more issues.</p>}</div>}
 <StatsCards loaded={candidates.length} stalled={flags.length} high={flags.filter(f=>f.priority==='High').length}/>
 <CandidateTable candidates={candidates} flags={flags} visible={visible} view={view} onView={setView} query={query} onQuery={setQuery} priority={priority} onPriority={setPriority} stage={stage} onStage={setStage} owner={owner} onOwner={setOwner} date={date} onExport={()=>downloadFlagsCsv(visible.filter(f=>(stage==='All'||f.stage===stage)&&(owner==='All'||f.owner===owner)))}/>
 <footer className="pb-4 text-center text-xs text-slate-400">PipelinePulse · Rules-based recommendations · Human review required before contacting candidates</footer></main></div>;
}
