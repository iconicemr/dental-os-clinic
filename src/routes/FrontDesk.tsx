import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Calendar, Clock, Stethoscope, Activity, CheckCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/use-mobile';
import QuickAddDrawer from './FrontDesk/QuickAddDrawer';
import ArrivedQueue from './FrontDesk/ArrivedQueue';
import ReadyQueue from './FrontDesk/ReadyQueue';
import TodayAppointments from './FrontDesk/TodayAppointments';
import InChairQueue from './FrontDesk/InChairQueue';
import CompletedQueue from './FrontDesk/CompletedQueue';
import GlobalPatientSlideOver from './FrontDesk/GlobalPatientSlideOver';
import QuickSwitcher from './FrontDesk/QuickSwitcher';
import { useToast } from '@/hooks/use-toast';

export default function FrontDesk() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Modal states
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [quickSwitcherOpen, setQuickSwitcherOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for quick switcher
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSwitcherOpen(true);
      }
      
      // / to focus search
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
      
      // A for Add Patient (when not in input)
      if (e.key === 'a' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePatientSelect = useCallback((patientId: string) => {
    setSelectedPatientId(patientId);
  }, []);

  const handleQuickAdd = useCallback(() => {
    setQuickAddOpen(true);
  }, []);

  const handlePatientCreated = useCallback(() => {
    toast({
      title: "Patient checked in",
      description: "Patient created and ready for intake",
    });
    // Refresh the queues
  }, [toast]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Front Desk Console</h1>
              <p className="text-sm text-muted-foreground">
                Universal patient flow • Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Ctrl+K</kbd> for quick search
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={handleQuickAdd} className="shrink-0">
                <UserPlus className="mr-2 h-4 w-4" />
                Quick Add & Check-in
              </Button>
            </div>
          </div>

          {/* Universal Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="global-search"
              placeholder="ابحث بالاسم العربي أو رقم الهاتف (Press / to focus)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          // Mobile: Tabs
          <div className="h-full p-4">
            {/* Add mobile tab implementation */}
            <div className="text-center text-muted-foreground">
              Mobile layout coming soon
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Top Row: Today's Appointments (Horizontal) */}
            <div className="bg-card rounded-lg border mb-4 mx-4 mt-4">
              <div className="border-b p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <h2 className="font-semibold text-sm">Today's Appointments</h2>
                </div>
              </div>
              <div className="p-2">
                <TodayAppointments 
                  searchTerm={debouncedSearchTerm}
                  onPatientSelect={handlePatientSelect}
                />
              </div>
            </div>

            {/* Bottom Row: 4 Columns */}
            <div className="grid grid-cols-4 gap-4 flex-1 px-4 pb-4 overflow-hidden">
              {/* Column 1: Arrived & Unsigned */}
              <div className="bg-card rounded-lg border h-full overflow-hidden">
                <div className="border-b p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <h2 className="font-semibold text-sm">Arrived & Unsigned</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Waiting for intake forms
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ArrivedQueue 
                    searchTerm={debouncedSearchTerm}
                    onPatientSelect={handlePatientSelect}
                  />
                </div>
              </div>

              {/* Column 2: Ready Queue */}
              <div className="bg-card rounded-lg border h-full overflow-hidden">
                <div className="border-b p-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-blue-500" />
                    <h2 className="font-semibold text-sm">Ready Queue</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Intake complete • Ready for visit
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ReadyQueue 
                    searchTerm={debouncedSearchTerm}
                    onPatientSelect={handlePatientSelect}
                  />
                </div>
              </div>

              {/* Column 3: In-Chair */}
              <div className="bg-card rounded-lg border h-full overflow-hidden">
                <div className="border-b p-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <h2 className="font-semibold text-sm">In-Chair</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently with provider
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <InChairQueue 
                    searchTerm={debouncedSearchTerm}
                    onPatientSelect={handlePatientSelect}
                  />
                </div>
              </div>

              {/* Column 4: Completed */}
              <div className="bg-card rounded-lg border h-full overflow-hidden">
                <div className="border-b p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <h2 className="font-semibold text-sm">Completed</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ready for checkout
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CompletedQueue 
                    searchTerm={debouncedSearchTerm}
                    onPatientSelect={handlePatientSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawers and Overlays */}
      <QuickAddDrawer
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      <GlobalPatientSlideOver
        patientId={selectedPatientId}
        isOpen={!!selectedPatientId}
        onClose={() => setSelectedPatientId(null)}
      />

      <QuickSwitcher
        isOpen={quickSwitcherOpen}
        onClose={() => setQuickSwitcherOpen(false)}
        onPatientSelect={handlePatientSelect}
      />
    </div>
  );
}