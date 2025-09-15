import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useFrontDeskRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen to changes on patients table
    const patientsChannel = supabase
      .channel('patients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Patient change detected:', payload);
          
          // Invalidate all front desk queries
          queryClient.invalidateQueries({ queryKey: ['today-appointments'] });
          queryClient.invalidateQueries({ queryKey: ['arrived-queue'] });
          queryClient.invalidateQueries({ queryKey: ['ready-queue'] });
          queryClient.invalidateQueries({ queryKey: ['in-chair-queue'] });
          queryClient.invalidateQueries({ queryKey: ['completed-queue'] });
        }
      )
      .subscribe();

    // Listen to changes on appointments table
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment change detected:', payload);
          
          // Invalidate appointment-related queries
          queryClient.invalidateQueries({ queryKey: ['today-appointments'] });
        }
      )
      .subscribe();

    // Listen to changes on visits table (for in-chair status)
    const visitsChannel = supabase
      .channel('visits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visits'
        },
        (payload) => {
          console.log('Visit change detected:', payload);
          
          // Invalidate visit-related queries
          queryClient.invalidateQueries({ queryKey: ['ready-queue'] });
          queryClient.invalidateQueries({ queryKey: ['in-chair-queue'] });
          queryClient.invalidateQueries({ queryKey: ['completed-queue'] });
        }
      )
      .subscribe();

    // Listen to changes on intake_forms table
    const intakeFormsChannel = supabase
      .channel('intake-forms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'intake_forms'
        },
        (payload) => {
          console.log('Intake form change detected:', payload);
          
          // Invalidate queues that depend on intake form status
          queryClient.invalidateQueries({ queryKey: ['arrived-queue'] });
          queryClient.invalidateQueries({ queryKey: ['ready-queue'] });
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(visitsChannel);
      supabase.removeChannel(intakeFormsChannel);
    };
  }, [queryClient]);
}