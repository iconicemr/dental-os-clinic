import { Navigate } from 'react-router-dom';
import { useMe } from '@/hooks/useMe';
import { CatalogWorkspace } from '@/components/admin/CatalogWorkspace';

export default function Admin() {
  const { profile } = useMe();

  // Route guard: only admins can access Admin page
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">
                System configuration and management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        <div className="p-4 sm:p-6">
          <CatalogWorkspace />
        </div>
      </div>
    </div>
  );
}