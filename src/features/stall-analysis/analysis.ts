export const STAGES = ['Applied', 'Screening', 'Interview', 'Assessment', 'Offer', 'Hired', 'Rejected', 'Withdrawn'] as const;
export type Stage = typeof STAGES[number];
export type Candidate = { id: string; name: string; email: string; role: string; stage: Stage; lastMovedAt: string; owner: string };
export type Flag = Candidate & { daysStalled: number; overdueDays: number; priority: 'High' | 'Medium' | 'Low'; explanation: string; action: string };
export type ParseResult = { candidates: Candidate[]; errors: string[] };
const CLOSED = new Set<Stage>(['Hired','Rejected','Withdrawn']);
const STAGE_ACTION: Record<Stage,string> = {
  Applied:'Review the application and decide whether to screen.',
  Screening:'Contact the recruiter to confirm the screening outcome.',
  Interview:'Request interview feedback and schedule the next step.',
  Assessment:'Check assessment completion and share the evaluation.',
  Offer:'Confirm the offer decision and follow up with the candidate.',
  Hired:'No follow-up needed.', Rejected:'No follow-up needed.', Withdrawn:'No follow-up needed.'
};
export function daysSince(date: string, today: string): number {
  const a = Date.parse(`${date}T00:00:00Z`), b = Date.parse(`${today}T00:00:00Z`);
  return Math.floor((b-a)/86400000);
}
function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0,10) === value;
}
export function validateRows(rows: Record<string,unknown>[], today: string): ParseResult {
  const errors: string[] = [], candidates: Candidate[] = [], seen = new Set<string>();
  if (!validDate(today)) throw new Error('Analysis date must be YYYY-MM-DD.');
  rows.forEach((row,index) => {
    const line = index+2;
    const field = (key:string) => String(row[key] ?? '').trim();
    const id=field('id'), name=field('name'), email=field('email'), role=field('role'), stage=field('stage'), lastMovedAt=field('lastMovedAt'), owner=field('owner');
    if (![id,name,email,role,stage,lastMovedAt,owner].every(Boolean)) { errors.push(`Row ${line}: required field missing.`); return; }
    if (seen.has(id)) { errors.push(`Row ${line}: duplicate candidate ID ${id}.`); return; }
    if (!STAGES.includes(stage as Stage)) { errors.push(`Row ${line}: unsupported stage "${stage}".`); return; }
    if (!validDate(lastMovedAt)) { errors.push(`Row ${line}: invalid date "${lastMovedAt}"; use YYYY-MM-DD.`); return; }
    if (daysSince(lastMovedAt,today)<0) { errors.push(`Row ${line}: last movement is in the future.`); return; }
    seen.add(id);
    candidates.push({id,name,email,role,stage:stage as Stage,lastMovedAt,owner});
  });
  return {candidates,errors};
}
export function analyze(candidates: Candidate[], threshold: number, today: string): Flag[] {
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 365) throw new Error('Threshold must be between 1 and 365 days.');
  if (!validDate(today)) throw new Error('Analysis date must be YYYY-MM-DD.');
  return candidates.flatMap(c => {
    if (CLOSED.has(c.stage)) return [];
    const daysStalled=daysSince(c.lastMovedAt,today);
    if (daysStalled < threshold) return [];
    const overdueDays=daysStalled-threshold;
    const priority: Flag['priority'] = overdueDays>=14 ? 'High' : overdueDays>=5 ? 'Medium' : 'Low';
    return [{...c,daysStalled,overdueDays,priority,explanation:`${c.name} has remained in ${c.stage} for ${daysStalled} days (threshold: ${threshold} days).`,action:STAGE_ACTION[c.stage]}];
  }).sort((a,b)=> b.overdueDays-a.overdueDays || a.name.localeCompare(b.name));
}
export function exportCsv(flags: Flag[]): string {
  const fields: (keyof Flag)[]=['id','name','email','role','stage','owner','lastMovedAt','daysStalled','overdueDays','priority','explanation','action'];
  const esc=(v:unknown)=>`"${String(v ?? '').replace(/"/g,'""')}"`;
  return [fields.join(','),...flags.map(f=>fields.map(k=>esc(f[k])).join(','))].join('\r\n');
}
