import { describe, expect, it } from 'vitest';
import { analyze, daysSince, exportCsv, validateRows, type Candidate } from '../features/stall-analysis/analysis';
const today='2026-10-14';
const candidate:Candidate={id:'1',name:'Jane',email:'j@example.com',role:'Engineer',stage:'Interview',lastMovedAt:'2026-10-01',owner:'Alex'};
describe('stall analysis',()=>{
 it('calculates UTC calendar-day difference',()=>expect(daysSince('2026-10-01',today)).toBe(13));
 it('flags a stalled candidate with an explanation and action',()=>{const [f]=analyze([candidate],7,today);expect(f.daysStalled).toBe(13);expect(f.priority).toBe('Medium');expect(f.action).toMatch(/feedback/);});
 it('does not flag below threshold',()=>expect(analyze([candidate],14,today)).toHaveLength(0));
 it('includes candidate exactly at threshold',()=>expect(analyze([candidate],13,today)).toHaveLength(1));
 it('excludes closed stages',()=>expect(analyze([{...candidate,stage:'Hired'}],7,today)).toHaveLength(0));
 it('sorts most overdue first',()=>expect(analyze([candidate,{...candidate,id:'2',lastMovedAt:'2026-09-01'}],7,today)[0].id).toBe('2'));
 it('rejects invalid thresholds',()=>expect(()=>analyze([candidate],0,today)).toThrow());
 it('rejects duplicate IDs, impossible dates, and future dates',()=>{const row={...candidate};const r=validateRows([row,row,{...row,id:'3',lastMovedAt:'2026-02-30'},{...row,id:'4',lastMovedAt:'2027-01-01'}],today);expect(r.candidates).toHaveLength(1);expect(r.errors).toHaveLength(3);});
 it('escapes commas and quotes in CSV exports',()=>expect(exportCsv([{...candidate,name:'Jane, "JJ"',daysStalled:13,overdueDays:6,priority:'Medium',explanation:'test',action:'test'}])).toContain('"Jane, ""JJ"""'));
});

describe('sample CSV interpretation',()=>{
 it('shows all eight loaded candidates but only five stalled at the default threshold',()=>{
 const rows=[['C001','Interview','2026-09-28'],['C002','Screening','2026-10-10'],['C003','Offer','2026-09-20'],['C004','Applied','2026-10-11'],['C005','Assessment','2026-10-03'],['C006','Hired','2026-09-10'],['C007','Interview','2026-10-05'],['C008','Applied','2026-09-15']];
 const candidates=rows.map(([id,stage,lastMovedAt])=>({...candidate,id,stage:stage as Candidate['stage'],lastMovedAt}));
 expect(candidates).toHaveLength(8);expect(analyze(candidates,7,today)).toHaveLength(5);
 });
});
