import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Appointment scheduling and calendar management
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Appointment System</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Appointment booking, scheduling, and calendar views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle appointment scheduling, calendar views, and booking management.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}