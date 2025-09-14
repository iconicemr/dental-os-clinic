import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function Billing() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Billing and payments with installment support
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Management</span>
            </CardTitle>
            <CardDescription>
              Coming soon: Billing, payments, and installment tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle billing, payment processing, and installment management.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}