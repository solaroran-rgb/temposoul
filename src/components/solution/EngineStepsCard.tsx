/* src/components/solution/EngineStepsCard.tsx */
import { useState } from 'react';
import type { EvidenceTrail } from '@core/shared/evidence';

interface EngineStepsCardProps {
  evidenceTrail: EvidenceTrail | null;
}

export function EngineStepsCard({ evidenceTrail }: EngineStepsCardProps) {
  const [expanded, setExpanded] = useState(false);
  if (!evidenceTrail) return null;
  const { items, summary } = evidenceTrail;

  return (
    <section aria-label="Engine Steps" style={{background:'#1e293b',borderRadius:12,padding:20,marginBottom:24}}>
      <h3 style={{color:'white',marginBottom:12}}>分析步骤</h3>
      <p style={{color:'#94a3b8',marginBottom:8}}>共 {items.length} 步 {summary}</p>
      <ul style={{listStyle:'none',padding:0}}>
        {items.map((it: { title: string }, i: number)=>(
          <li key={i} style={{marginBottom:4}}>{
            `${i+1}. ${it.title}`
          }</li>
        ))}
      </ul>
      <button onClick={()=>setExpanded(v=>!v)} style={{marginTop:8,background:'transparent',border:'1px solid #6366f1',color:'#a5b4fc',borderRadius:6,padding:'4px 8px'}}>{expanded?'收起':'展开全部'}</button>
    </section>
  );
}

export default EngineStepsCard;