import Papa from 'papaparse';
import { exportCsv, validateRows, type Candidate } from '../features/stall-analysis/analysis';
export type CsvImport = { candidates: Candidate[]; errors: string[] };
export function parseCandidates(file: File, today: string): Promise<CsvImport> {
 return new Promise(resolve => Papa.parse<Record<string,unknown>>(file, {header:true,skipEmptyLines:true,
  complete(result) {
   const required=['id','name','email','role','stage','lastMovedAt','owner'];
   const missing=required.filter(k=>!result.meta.fields?.includes(k));
   if(missing.length) {resolve({candidates:[],errors:[`Missing CSV columns: ${missing.join(', ')}`]});return;}
   const checked=validateRows(result.data,today);
   resolve({candidates:checked.candidates,errors:[...result.errors.map(e=>`CSV row ${e.row+2}: ${e.message}`),...checked.errors]});
  },error(e){resolve({candidates:[],errors:[e.message]});}
 }));
}
export function downloadFlagsCsv(flags: Parameters<typeof exportCsv>[0]): void {
 const blob=new Blob([exportCsv(flags)],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download='pipeline-pulse-flags.csv';a.click();
 setTimeout(()=>URL.revokeObjectURL(url),0);
}
