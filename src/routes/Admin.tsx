import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Users, Stethoscope, Settings, BookOpen, FileText, Plus } from 'lucide-react';
import { useMe } from '@/hooks/useMe';
import { useAdmin } from '@/hooks/useAdmin';
import { format } from 'date-fns';

export default function Admin() {
  const { profile } = useMe();
  const { useStaff, useProviders, useRooms, useDiagnoses, useTreatments, useAuditLog } = useAdmin();
  
  const { data: staff } = useStaff();
  const { data: providers } = useProviders();
  const { data: rooms } = useRooms();
  const { data: diagnoses } = useDiagnoses();
  const { data: treatments } = useTreatments();
  const { data: auditLog } = useAuditLog();

  // Route guard: only admins can access Admin page
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="h-8 w-8 mr-3" />
          Administration
        </h1>
        <p className="text-muted-foreground">Manage staff, providers, configuration, and system catalog</p>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Staff Management
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Clinics</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff?.map((member) => (
                    <TableRow key={member.user_id}>
                      <TableCell>{member.full_name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.role}</Badge>
                      </TableCell>
                      <TableCell>{member.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {member.staff_clinics?.map(sc => sc.clinics.name).join(', ') || 'None'}
                      </TableCell>
                      <TableCell>{format(new Date(member.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Providers
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Provider
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers?.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>{provider.display_name}</TableCell>
                      <TableCell>{provider.specialty || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={provider.active ? 'default' : 'secondary'}>
                          {provider.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Clinic Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Rooms</h3>
                  <div className="space-y-2">
                    {rooms?.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{room.name}</span>
                        <Badge variant={room.is_active ? 'default' : 'secondary'}>
                          {room.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Calendar Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Slot Duration</label>
                      <p className="text-sm text-muted-foreground">15 minutes</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Working Hours</label>
                      <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Diagnoses ({diagnoses?.length})
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {diagnoses?.slice(0, 10).map((diagnosis) => (
                    <div key={diagnosis.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{diagnosis.name_en}</p>
                        {diagnosis.code && <p className="text-xs text-muted-foreground">{diagnosis.code}</p>}
                      </div>
                      <Badge variant={diagnosis.active ? 'default' : 'secondary'}>
                        {diagnosis.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Treatments ({treatments?.length})
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {treatments?.slice(0, 10).map((treatment) => (
                    <div key={treatment.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{treatment.name_en}</p>
                        {treatment.code && <p className="text-xs text-muted-foreground">{treatment.code}</p>}
                      </div>
                      <Badge variant={treatment.active ? 'default' : 'secondary'}>
                        {treatment.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Record</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog?.slice(0, 20).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.changed_at), 'MMM dd HH:mm')}</TableCell>
                      <TableCell>{entry.changed_by || 'System'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.operation}</Badge>
                      </TableCell>
                      <TableCell>{entry.table_name}</TableCell>
                      <TableCell>{entry.row_pk || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}