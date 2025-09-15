import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PatientSearchStep from './PatientSearchStep';
import CreatePatientStep from './CreatePatientStep';
import ExistingPatientStep from './ExistingPatientStep';
import ActionPickerStep from './ActionPickerStep';
import CalendarPickerModal from './CalendarPickerModal';

export type AddPatientStep = 'search' | 'create' | 'existing' | 'actions' | 'calendar';

export interface SearchResult {
  id: string;
  arabic_full_name: string;
  phone: string | null;
  status: string;
  created_at: string;
}

export interface CreatedPatient {
  id: string;
  arabic_full_name: string;
  phone: string | null;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function AddPatientModal({ isOpen, onClose, onComplete }: AddPatientModalProps) {
  const [currentStep, setCurrentStep] = useState<AddPatientStep>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<SearchResult | CreatedPatient | null>(null);

  const handleClose = () => {
    setCurrentStep('search');
    setSearchTerm('');
    setSelectedPatient(null);
    onClose();
  };

  const handleSearchResults = (results: SearchResult[], term: string) => {
    setSearchTerm(term);
    if (results.length === 0) {
      setCurrentStep('create');
    }
  };

  const handleSelectExisting = (patient: SearchResult) => {
    setSelectedPatient(patient);
    setCurrentStep('existing');
  };

  const handlePatientCreated = (patient: CreatedPatient) => {
    setSelectedPatient(patient);
    setCurrentStep('actions');
  };

  const handleConfirmExisting = () => {
    setCurrentStep('actions');
  };

  const handleWalkIn = () => {
    handleClose();
    onComplete();
  };

  const handleAppointment = () => {
    // Navigate to calendar page for scheduling
    try {
      // Lazy import to avoid extra dependency in this file
      const { useNavigate } = require('react-router-dom');
      const navigate = useNavigate();
      if (selectedPatient) {
        navigate(`/calendar?patientId=${selectedPatient.id}`);
      } else if (searchTerm) {
        navigate('/calendar');
      }
    } catch (e) {
      // Fallback: just close
    }
    handleClose();
    onComplete();
  };

  const handleBackToSearch = () => {
    setCurrentStep('search');
    setSelectedPatient(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'search':
        return (
          <PatientSearchStep
            onSearchResults={handleSearchResults}
            onSelectExisting={handleSelectExisting}
          />
        );
      case 'create':
        return (
          <CreatePatientStep
            initialPhone={searchTerm}
            onPatientCreated={handlePatientCreated}
            onCancel={handleBackToSearch}
          />
        );
      case 'existing':
        return (
          <ExistingPatientStep
            patient={selectedPatient as SearchResult}
            onConfirm={handleConfirmExisting}
            onCancel={handleBackToSearch}
          />
        );
      case 'actions':
        return (
          <ActionPickerStep
            patient={selectedPatient!}
            onWalkIn={handleWalkIn}
            onAppointment={handleAppointment}
            onCancel={handleBackToSearch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          {renderStep()}
        </DialogContent>
      </Dialog>
    </>
  );
}