import { useState } from 'react';
import { ClinicalTopBar } from '@/components/Clinical/ClinicalTopBar';
import { QueueSidebar } from '@/components/Clinical/QueueSidebar';
import { FindingsCenter } from '@/components/Clinical/FindingsCenter';
import { DoctorPanel } from '@/components/Clinical/DoctorPanel';
import { useClinicalWorkflow } from '@/hooks/useClinicalWorkflow';

export default function Clinical() {
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);
  const { activeVisit, activePatient } = useClinicalWorkflow(activeVisitId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <ClinicalTopBar 
        activePatient={activePatient}
        activeVisit={activeVisit}
        onVisitChange={setActiveVisitId}
      />
      
      {/* Three-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Queue Sidebar */}
        <QueueSidebar 
          activeVisitId={activeVisitId}
          onVisitSelect={setActiveVisitId}
        />
        
        {/* Center: Findings */}
        <FindingsCenter 
          visitId={activeVisitId}
          patient={activePatient}
        />
        
        {/* Right: Doctor Panel */}
        <DoctorPanel 
          visitId={activeVisitId}
          patient={activePatient}
        />
      </div>
    </div>
  );
}