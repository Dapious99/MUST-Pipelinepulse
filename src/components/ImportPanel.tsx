import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileSpreadsheet, LoaderCircle, UploadCloud } from 'lucide-react';

export type ImportStatus = { state: 'idle' | 'loading' | 'success' | 'error'; message: string; count?: number; rejected?: number };
type Props = { filename: string; status: ImportStatus; onUpload: (file: File) => void; onSample: () => void };

export function ImportPanel({ filename, status, onUpload, onSample }: Props) {
 const [dragging, setDragging] = useState(false);
 const busy = status.state === 'loading';
 function accept(file?: File) { if (file && !busy) onUpload(file); }
 return <section aria-label="Import hiring data" aria-busy={busy} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-bold"><FileSpreadsheet className="text-teal-600" size={20}/> Import hiring data</div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">CSV only</span></div>
  <label onDragOver={e=>{e.preventDefault();if(!busy)setDragging(true)}} onDragLeave={e=>{e.preventDefault();setDragging(false)}} onDrop={e=>{e.preventDefault();setDragging(false);accept(e.dataTransfer.files[0])}} className={`flex min-h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${busy?'cursor-wait border-slate-200 bg-slate-50':dragging?'cursor-copy border-teal-500 bg-teal-100':'cursor-pointer border-teal-200 bg-teal-50/40 hover:border-teal-400 hover:bg-teal-50'}`}>
   {busy?<LoaderCircle aria-hidden="true" className="mb-2 animate-spin text-teal-600" size={28}/>:<UploadCloud aria-hidden="true" className="mb-2 text-teal-600" size={28}/>}
   <span className="font-semibold">{busy?'Reading and validating CSV…':'Drop a CSV here or browse files'}</span>
   <span className="mt-1 text-sm text-slate-500">{busy?'Checking candidate records':filename||'Files stay in your browser'}</span>
   <input aria-label="Upload candidate CSV" disabled={busy} type="file" accept=".csv,text/csv" className="sr-only" onChange={e=>{accept(e.target.files?.[0]);e.target.value='';}}/>
  </label>
  <div aria-live="polite" aria-atomic="true" role="status" className="mt-3 min-h-11">
   {status.state==='loading'&&<div className="flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800"><LoaderCircle className="shrink-0 animate-spin" size={16}/>{status.message}</div>}
   {status.state==='success'&&<div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 shrink-0" size={16}/><span>{status.message}{status.rejected?` ${status.rejected} row(s) need attention.`:''}</span></div>}
   {status.state==='error'&&<div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800"><AlertCircle className="mt-0.5 shrink-0" size={16}/>{status.message}</div>}
  </div>
  <div className="mt-1 flex items-center justify-between gap-3"><button disabled={busy} className="text-sm font-semibold text-teal-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50" onClick={onSample}>Try with sample data →</button><span className="text-xs text-slate-400">No server upload</span></div>
 </section>;
}
