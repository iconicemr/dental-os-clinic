import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';

export default function Clinical() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Clinical</h1>
          <p className="text-muted-foreground">
            Clinical recording: Diagnosis → Tooth → Treatment with age-aware selection
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5" />
              <span>Clinical Records</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Clinical recording with tooth charts and treatment planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle clinical recording, age-aware tooth selection, diagnosis, and treatment planning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}