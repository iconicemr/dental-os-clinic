import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function Intake() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Intake</h1>
          <p className="text-muted-foreground">
            Patient intake forms with Arabic signature support
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Patient Intake</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Digital intake forms with Arabic signature capability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle patient intake forms, medical history, and Arabic digital signatures.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}