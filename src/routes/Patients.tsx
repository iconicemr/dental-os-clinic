import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function Patients() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records, search by Arabic names/phone numbers
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Patient Management</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Patient registration, search, and record management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle patient CRUD operations, Arabic name/phone search, and patient records.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}