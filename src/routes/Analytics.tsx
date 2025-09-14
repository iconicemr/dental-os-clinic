import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Clinic performance analytics and reporting
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Analytics</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Comprehensive analytics and performance reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will provide analytics, performance metrics, and detailed reporting.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}