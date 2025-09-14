import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function Expenses() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Clinic expense tracking and management
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Expense Management</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Expense tracking, categorization, and reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle clinic expense tracking, categorization, and financial reporting.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}