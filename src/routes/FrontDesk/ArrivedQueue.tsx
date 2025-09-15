import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Phone, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ArrivedQueueProps {
  searchTerm: string;
  onPatientSelect: (patientId: string) => void;
}

export default function ArrivedQueue({ searchTerm, onPatientSelect }: ArrivedQueueProps) {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['arrived-queue', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('id, arabic_full_name, phone, created_at, updated_at')
        .eq('status', 'arrived')
        .order('updated_at', { ascending: true }); // First arrived, first served

      if (searchTerm) {
        query = query.or(`arabic_full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleOpenIntake = (patientId: string) => {
    // This would open the tablet intake form
    // For now, we'll just select the patient to show their details
    onPatientSelect(patientId);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-muted/50 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No patients waiting for intake</p>
        {searchTerm && (
          <p className="text-xs mt-1">No results for "{searchTerm}"</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      {patients.map((patient) => (
        <div
          key={patient.id}
          className="bg-background border rounded-lg p-3 hover:bg-muted/50 transition-colors"
        >
          {/* Patient Info */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <h3 className="font-medium text-sm truncate">
                  {patient.arabic_full_name}
                </h3>
              </div>
              
              {patient.phone && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{patient.phone}</span>
                </div>
              )}
            </div>

            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 shrink-0">
              Arrived
            </Badge>
          </div>

          {/* Wait Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Clock className="h-3 w-3" />
            <span>Waiting {formatDistanceToNow(new Date(patient.updated_at))}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleOpenIntake(patient.id)}
              className="flex-1 text-xs"
            >
              <FileText className="mr-1 h-3 w-3" />
              Open Intake
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPatientSelect(patient.id)}
              className="text-xs"
            >
              <User className="mr-1 h-3 w-3" />
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}