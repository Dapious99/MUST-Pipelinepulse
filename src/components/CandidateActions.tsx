import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal, Pencil, RotateCcw, UserX } from 'lucide-react';
import type { Candidate } from '../features/stall-analysis/analysis';

type Props = {
  candidate: Candidate;
  revoked: boolean;
  onEdit: (candidate: Candidate) => void;
  onRevoke: (candidate: Candidate) => void;
  onRestore: (candidate: Candidate) => void;
};

export function CandidateActions({ candidate, revoked, onEdit, onRevoke, onRestore }: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!triggerRef.current?.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    const closeOnScroll = (event: Event) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('resize', closeOnScroll);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('scroll', closeOnScroll, true);
      window.removeEventListener('resize', closeOnScroll);
    };
  }, [open]);

  const toggle = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = revoked ? 68 : 112;
      setPosition({
        top: rect.bottom + menuHeight + 8 > window.innerHeight ? Math.max(8, rect.top - menuHeight - 6) : rect.bottom + 6,
        left: Math.max(8, Math.min(rect.right - 176, window.innerWidth - 184)),
      });
    }
    setOpen(value => !value);
  };

  const act = (handler: (candidate: Candidate) => void) => {
    setOpen(false);
    handler(candidate);
  };

  return <>
    <button ref={triggerRef} type="button" onClick={toggle} aria-label={`Actions for ${candidate.name}`} aria-expanded={open} aria-haspopup="menu" className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${open ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
      <MoreHorizontal size={20} aria-hidden="true" />
    </button>
    {open && createPortal(
      <div ref={menuRef} role="menu" aria-label={`Actions for ${candidate.name}`} style={{ position: 'fixed', top: position.top, left: position.left, width: 176, zIndex: 1000 }} className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
        {revoked ? (
          <button type="button" role="menuitem" onClick={() => act(onRestore)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-teal-700 hover:bg-teal-50 focus:bg-teal-50"><RotateCcw size={16}/> Restore</button>
        ) : <>
          <button type="button" role="menuitem" onClick={() => act(onEdit)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 focus:bg-slate-50"><Pencil size={16}/> Edit candidate</button>
          <div className="my-1 border-t border-slate-100" />
          <button type="button" role="menuitem" onClick={() => act(onRevoke)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"><UserX size={16}/> Revoke</button>
        </>}
      </div>, document.body
    )}
  </>;
}
