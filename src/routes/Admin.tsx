import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffTable from '@/components/admin/StaffTable';
import ProvidersTable from '@/components/admin/ProvidersTable';
import { useMe } from '@/hooks/useMe';

export default function Admin() {
  const { profile } = useMe();

  // Route guard: only admins can access Admin page
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">Manage staff roles, clinic membership, and providers.</p>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
          <StaffTable />
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <ProvidersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
