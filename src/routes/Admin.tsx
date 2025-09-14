import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function Admin() {
  const { profile } = useAppStore();

  if (profile?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="medical-shadow">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="text-muted-foreground">
            System administration and user management
          </p>
        </div>

        <Card className="medical-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Administration</span>
            </CardTitle>
            <CardDescription>
              Coming soon: User management, clinic settings, and system configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section will handle user management, clinic configuration, and system administration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}