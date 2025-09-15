import { Routes, Route } from 'react-router-dom';
import IntakePatientSelector from './Intake/IntakePatientSelector';
import IntakeForm from './Intake/IntakeForm';

export default function Intake() {
  return (
    <Routes>
      <Route index element={<IntakePatientSelector />} />
      <Route path="form" element={<IntakeForm />} />
    </Routes>
  );
}