import { useMemo, useState } from 'react';
import { analyze, type Candidate } from '../features/stall-analysis/analysis';
import { parseCandidates, downloadFlagsCsv } from '../lib/csv';
import { Header } from '../components/Header';
import { ImportPanel } from '../components/ImportPanel';
import { AnalysisSettings } from '../components/AnalysisSettings';
import { StatsCards } from '../components/StatsCards';
import { CandidateTable } from '../components/CandidateTable';
function todayUTC(){return new Date().toISOString().slice(0,10);}
export function DashboardPage(){
 const [candidates,setCandidates]=useState<Candidate[]>([]),[errors,setErrors]=useState<string[]>([]);
 const [threshold,setThreshold]=useState(7),[date,setDate]=useState(todayUTC()),[query,setQuery]=useState(''),[priority,setPriority]=useState('All');
 const [view,setView]=useState<'stalled'|'all'>('stalled'),[filename,setFilename]=useState('');
 const flags=useMemo(()=>analyze(candidates,threshold,date),[candidates,threshold,date]);
 const visible=flags.filter(f=>(priority==='All'||f.priority===priority)&&[f.name,f.role,f.stage,f.owner].some(s=>s.toLowerCase().includes(query.toLowerCase())));
 async function readCsv(file:File){setFilename(file.name);try{const result=await parseCandidates(file,date);setCandidates(result.candidates);setErrors(result.errors);setView('stalled');setPriority('All');setQuery('');}catch(e){setCandidates([]);setErrors([e instanceof Error?e.message:'Could not read CSV']);}}
 async function loadSample(){try{const response=await fetch('/sample-candidates.csv');if(!response.ok)throw new Error('Sample CSV could not be loaded.');const blob=await response.blob();await readCsv(new File([blob],'sample-candidates.csv',{type:'text/csv'}));}catch(e){setErrors([e instanceof Error?e.message:'Could not load sample']);}}
 return <div className="min-h-screen bg-slate-50 text-slate-800"><Header/><main className="mx-auto max-w-7xl space-y-7 px-5 py-9"><div><p className="text-sm font-semibold text-teal-700">RECRUITING OPERATIONS</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Keep your hiring pipeline moving.</h2><p className="mt-2 text-slate-500">Find stalled candidates, understand why they're flagged, and prioritize the next follow-up.</p></div>
 <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]"><ImportPanel filename={filename} onUpload={readCsv} onSample={loadSample}/><AnalysisSettings threshold={threshold} date={date} onThreshold={setThreshold} onDate={setDate}/></section>
 {errors.length>0&&<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-900">{errors.length} import issue(s)</h3><ul className="mt-2 list-disc pl-5 text-sm text-amber-900">{errors.slice(0,12).map((e,i)=><li key={i}>{e}</li>)}</ul>{errors.length>12&&<p className="mt-2 text-sm">And {errors.length-12} more issues.</p>}</div>}
 <StatsCards loaded={candidates.length} stalled={flags.length} high={flags.filter(f=>f.priority==='High').length}/>
 <CandidateTable candidates={candidates} flags={flags} visible={visible} view={view} onView={setView} query={query} onQuery={setQuery} priority={priority} onPriority={setPriority} onExport={()=>downloadFlagsCsv(visible)}/>
 <footer className="pb-4 text-center text-xs text-slate-400">PipelinePulse · Rules-based recommendations · Human review required before contacting candidates</footer></main></div>;
}
