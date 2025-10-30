import { Calendar, Clock, Mail, Phone, Briefcase, FileText, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Appointment } from '../types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'confirmed' | 'cancelled' | 'completed') => void;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onStatusChange
}: AppointmentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {appointment.customer_name}
          </h3>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[appointment.status]}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        <div className="flex gap-2">
          {appointment.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Confirm appointment"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, 'cancelled')}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel appointment"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <button
              onClick={() => onStatusChange(appointment.id, 'completed')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Mark as completed"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onEdit(appointment)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit appointment"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this appointment?')) {
                onDelete(appointment.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete appointment"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-700">
          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
          <span>{formatDate(appointment.appointment_date)}</span>
        </div>

        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-3 text-gray-400" />
          <span>
            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
          </span>
        </div>

        <div className="flex items-center text-gray-700">
          <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
          <span>{appointment.service_type}</span>
        </div>

        <div className="flex items-center text-gray-700">
          <Mail className="w-4 h-4 mr-3 text-gray-400" />
          <span>{appointment.customer_email}</span>
        </div>

        {appointment.customer_phone && (
          <div className="flex items-center text-gray-700">
            <Phone className="w-4 h-4 mr-3 text-gray-400" />
            <span>{appointment.customer_phone}</span>
          </div>
        )}

        {appointment.notes && (
          <div className="flex items-start text-gray-700 pt-2 border-t border-gray-100">
            <FileText className="w-4 h-4 mr-3 text-gray-400 mt-1" />
            <span className="text-sm">{appointment.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
