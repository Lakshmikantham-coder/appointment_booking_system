import { useState, useEffect } from 'react';
import { CalendarCheck, Plus, Loader2, AlertCircle } from 'lucide-react';
import type { Appointment, AppointmentFormData, AppointmentStatus } from './types/appointment';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
} from './services/appointmentService';

type ViewMode = 'list' | 'form';

export default function App() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setError(null);
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCreateAppointment = async (formData: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newAppointment = await createAppointment(formData);
      setAppointments(prev => [...prev, newAppointment]);
      setViewMode('list');
      setSelectedAppointment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (formData: AppointmentFormData) => {
    if (!selectedAppointment) return;

    setIsLoading(true);
    setError(null);

    try {
      const updated = await updateAppointment(selectedAppointment.id, formData);
      setAppointments(prev =>
        prev.map(apt => (apt.id === updated.id ? updated : apt))
      );
      setViewMode('list');
      setSelectedAppointment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setError(null);

    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments(prev =>
        prev.map(apt => (apt.id === updated.id ? updated : apt))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    setError(null);

    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewMode('form');
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedAppointment(null);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setViewMode('form');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <CalendarCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Appointment Booking System
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and schedule your appointments efficiently
                </p>
              </div>
            </div>

            {viewMode === 'list' && (
              <button
                onClick={handleNewAppointment}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                New Appointment
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        <main className="bg-white rounded-xl shadow-lg p-8">
          {viewMode === 'form' ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {selectedAppointment ? 'Edit Appointment' : 'Book New Appointment'}
              </h2>
              <AppointmentForm
                onSubmit={selectedAppointment ? handleUpdateAppointment : handleCreateAppointment}
                onCancel={handleCancelForm}
                existingAppointments={appointments}
                initialData={selectedAppointment}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Appointments ({appointments.length})
              </h2>
              <AppointmentList
                appointments={appointments}
                onEdit={handleEdit}
                onDelete={handleDeleteAppointment}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </main>

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Business Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
        </footer>
      </div>
    </div>
  );
}
