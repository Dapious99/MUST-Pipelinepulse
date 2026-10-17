import { describe, expect, it } from 'vitest';
import { analyze, validateRows, type Candidate } from '../features/stall-analysis/analysis';
const today = '2026-10-16';
const candidate = (i: number): Candidate => ({ id: String(i), name: `Candidate ${i}`, email: `c${i}@example.test`, role: 'Engineer', stage: 'Interview', lastMovedAt: '2026-09-20', owner: 'Alex' });
describe('Day 3 increased load and edge cases', () => {
 it('processes 5000 candidates without dropping records', () => { const rows=Array.from({length:5000},(_,i)=>candidate(i)); expect(analyze(rows,7,today)).toHaveLength(5000); });
 it('does not flag future or impossible dates even when directly analyzing', () => { expect(analyze([{...candidate(1),lastMovedAt:'2027-01-01'},{...candidate(2),lastMovedAt:'2026-02-30'}],7,today)).toHaveLength(0); });
 it('preserves valid rows and reports invalid rows', () => { const rows=[candidate(1),candidate(1),{...candidate(2),email:'invalid'},{...candidate(3),lastMovedAt:'2027-01-01'}]; const result=validateRows(rows,today); expect(result.candidates).toHaveLength(1); expect(result.errors).toHaveLength(3); });
 it('sorts results by most overdue',()=>{const rows=[{...candidate(1),lastMovedAt:'2026-10-01'},candidate(2)];expect(analyze(rows,7,today)[0].id).toBe('2');});
});
