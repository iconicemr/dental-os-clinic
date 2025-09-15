import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Stethoscope, Settings, BookOpen, FileText } from 'lucide-react';
import { useMe } from '@/hooks/useMe';
import { StaffManagement } from '@/components/admin/StaffManagement';
import { ProvidersManagement } from '@/components/admin/ProvidersManagement';
import { ConfigurationManagement } from '@/components/admin/ConfigurationManagement';
import { CatalogWorkspace } from '@/components/admin/CatalogWorkspace';
import { AuditManagement } from '@/components/admin/AuditManagement';

export default function Admin() {
  const { profile } = useMe();

  // Route guard: only admins can access Admin page
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">IconiDent Admin Portal</h1>
              <p className="text-muted-foreground">
                Manage staff, providers, clinic configuration, and system catalog
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="staff" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 h-12">
            <TabsTrigger value="staff" className="flex items-center space-x-2 data-[state=active]:bg-background">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center space-x-2 data-[state=active]:bg-background">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Providers</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2 data-[state=active]:bg-background">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center space-x-2 data-[state=active]:bg-background">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Catalog</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2 data-[state=active]:bg-background">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff" className="mt-8">
            <StaffManagement />
          </TabsContent>

          <TabsContent value="providers" className="mt-8">
            <ProvidersManagement />
          </TabsContent>

          <TabsContent value="config" className="mt-8">
            <ConfigurationManagement />
          </TabsContent>

          <TabsContent value="catalog" className="mt-8">
            <CatalogWorkspace />
          </TabsContent>

          <TabsContent value="audit" className="mt-8">
            <AuditManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}