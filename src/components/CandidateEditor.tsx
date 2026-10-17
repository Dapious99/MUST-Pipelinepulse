import { useEffect, useState } from 'react';
import { STAGES, type Candidate, type Stage } from '../features/stall-analysis/analysis';
type Props={candidate:Candidate; onSave:(candidate:Candidate)=>void; onClose:()=>void};
export function CandidateEditor({candidate,onSave,onClose}:Props){
 const [draft,setDraft]=useState(candidate);
 const [error,setError]=useState('');
 useEffect(()=>setDraft(candidate),[candidate]);
 const update=(key:keyof Candidate,value:string)=>setDraft(previous=>({...previous,[key]:value}));
 function submit(e:React.FormEvent){e.preventDefault();
  if(!draft.name.trim()||!draft.role.trim()||!draft.owner.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)){setError('Enter a name, valid email, role, and owner.');return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(draft.lastMovedAt)||Number.isNaN(Date.parse(draft.lastMovedAt))||new Date(draft.lastMovedAt).toISOString().slice(0,10)!==draft.lastMovedAt){setError('Enter a valid movement date.');return;}
  onSave({...draft,name:draft.name.trim(),email:draft.email.trim(),role:draft.role.trim(),owner:draft.owner.trim()});
 }
 return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section role="dialog" aria-modal="true" aria-labelledby="edit-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><h2 id="edit-title" className="text-xl font-bold">Edit candidate</h2><p className="mt-1 text-sm text-slate-500">Changes are local to this session and included in current analysis.</p><form onSubmit={submit} className="mt-5 grid gap-3">{(['name','email','role','owner'] as const).map(key=><label key={key} className="text-sm font-medium capitalize">{key}<input className="mt-1 w-full rounded-lg border border-slate-300 p-2" value={draft[key]} onChange={e=>update(key,e.target.value)} required/></label>)}<label className="text-sm font-medium">Stage<select className="mt-1 w-full rounded-lg border border-slate-300 p-2" value={draft.stage} onChange={e=>update('stage',e.target.value as Stage)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></label><label className="text-sm font-medium">Last moved<input type="date" className="mt-1 w-full rounded-lg border border-slate-300 p-2" value={draft.lastMovedAt} onChange={e=>update('lastMovedAt',e.target.value)} required/></label>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<div className="mt-2 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button><button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white">Save changes</button></div></form></section></div>;
}
