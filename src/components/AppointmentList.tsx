import { useState } from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../types/appointment';
import AppointmentCard from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'confirmed' | 'cancelled' | 'completed') => void;
}

type FilterOption = 'all' | AppointmentStatus;

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  onStatusChange
}: AppointmentListProps) {
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredAppointments = appointments.filter(apt =>
    filter === 'all' ? true : apt.status === filter
  );

  const groupByDate = (appointments: Appointment[]) => {
    const groups: Record<string, Appointment[]> = {};

    appointments.forEach(apt => {
      if (!groups[apt.appointment_date]) {
        groups[apt.appointment_date] = [];
      }
      groups[apt.appointment_date].push(apt);
    });

    return Object.entries(groups).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    );
  };

  const groupedAppointments = groupByDate(filteredAppointments);

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filter:</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterOption[]).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'There are no appointments scheduled yet.'
              : `No ${filter} appointments to display.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedAppointments.map(([date, appointments]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                {formatGroupDate(date)}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {appointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
