import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import ProtectedRoute from "@/components/Guards/ProtectedRoute";
import AppShell from "@/components/AppShell/AppShell";

// Route components
import Login from "@/routes/auth/Login";
import Dashboard from "@/routes/Dashboard";
import Setup from "@/routes/Setup";
import Patients from "@/routes/Patients";
import Intake from "@/routes/Intake";
import WaitingRoom from "@/routes/WaitingRoom";
import Calendar from "@/routes/Calendar";
import Clinical from "@/routes/Clinical";
import Billing from "@/routes/Billing";
import Expenses from "@/routes/Expenses";
import Analytics from "@/routes/Analytics";
import Admin from "@/routes/Admin";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/login" element={<Login />} />
          
          {/* Protected routes with app shell */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/setup" element={<Setup />} />
          
          <Route path="/patients" element={
            <ProtectedRoute>
              <AppShell>
                <Patients />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/intake" element={
            <ProtectedRoute>
              <AppShell>
                <Intake />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/waiting-room" element={
            <ProtectedRoute>
              <AppShell>
                <WaitingRoom />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <AppShell>
                <Calendar />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/clinical" element={
            <ProtectedRoute>
              <AppShell>
                <Clinical />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/billing" element={
            <ProtectedRoute>
              <AppShell>
                <Billing />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/expenses" element={
            <ProtectedRoute>
              <AppShell>
                <Expenses />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <AppShell>
                <Analytics />
              </AppShell>
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AppShell>
                <Admin />
              </AppShell>
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
