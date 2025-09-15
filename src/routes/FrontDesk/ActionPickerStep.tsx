import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserCheck, Calendar, ArrowLeft, Info } from 'lucide-react';
import { useWalkIn } from '@/hooks/useFrontDeskActions';
import { useToast } from '@/hooks/use-toast';
import { SearchResult, CreatedPatient } from './AddPatientModal';

interface ActionPickerStepProps {
  patient: SearchResult | CreatedPatient;
  onWalkIn: () => void;
  onAppointment: () => void;
  onCancel: () => void;
}

export default function ActionPickerStep({ patient, onWalkIn, onAppointment, onCancel }: ActionPickerStepProps) {
  const { toast } = useToast();
  const walkInMutation = useWalkIn();

  const isPatientAlreadyHere = 'status' in patient && ['arrived', 'ready'].includes(patient.status);

  const handleWalkIn = async () => {
    try {
      await walkInMutation.mutateAsync(patient.id);
      
      toast({
        title: "Walk-in successful",
        description: "Patient checked in and ready for intake",
      });
      
      onWalkIn();
    } catch (error) {
      console.error('Error with walk-in:', error);
      toast({
        title: "Error",
        description: "Failed to check in patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Choose Action</DialogTitle>
        <DialogDescription>
          What would you like to do with <span className="font-medium" dir="rtl">{patient.arabic_full_name}</span>?
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-6">
        {isPatientAlreadyHere && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This patient is already here today with status: <strong>{('status' in patient) ? patient.status : ''}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Walk-in Option */}
          <Card className={`cursor-pointer transition-colors ${isPatientAlreadyHere ? 'opacity-50' : 'hover:bg-muted/50'}`}>
            <CardContent className="p-4">
              <Button 
                variant="ghost" 
                className="w-full h-auto p-0 justify-start"
                onClick={handleWalkIn}
                disabled={isPatientAlreadyHere || walkInMutation.isPending}
              >
                <div className="flex items-start gap-3 w-full">
                  <UserCheck className="h-6 w-6 text-yellow-600 mt-1" />
                  <div className="text-left flex-1">
                    <h3 className="font-medium mb-1">
                      {walkInMutation.isPending ? 'Processing...' : '🚶 Walk-in'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Check in patient immediately. Sets status to "arrived" and creates today's appointment if needed.
                    </p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Appointment Option */}
          <Card className="cursor-pointer transition-colors hover:bg-muted/50">
            <CardContent className="p-4">
              <Button 
                variant="ghost" 
                className="w-full h-auto p-0 justify-start"
                onClick={onAppointment}
              >
                <div className="flex items-start gap-3 w-full">
                  <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="text-left flex-1">
                    <h3 className="font-medium mb-1">📅 Schedule Appointment</h3>
                    <p className="text-sm text-muted-foreground">
                      Pick a specific date and time slot. Choose provider and room.
                    </p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="w-full mt-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patient
        </Button>
      </div>
    </>
  );
}