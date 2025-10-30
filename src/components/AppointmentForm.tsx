import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Briefcase, FileText } from 'lucide-react';
import type { AppointmentFormData, Appointment } from '../types/appointment';
import { validateAppointmentTime, hasAppointmentConflict } from '../utils/appointmentValidation';

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
  existingAppointments: Appointment[];
  initialData?: Appointment | null;
  isLoading?: boolean;
}

const SERVICE_TYPES = [
  'Consultation',
  'Follow-up',
  'Initial Assessment',
  'Review',
  'Treatment',
  'Other'
];

export default function AppointmentForm({
  onSubmit,
  onCancel,
  existingAppointments,
  initialData,
  isLoading = false
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    service_type: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        customer_name: initialData.customer_name,
        customer_email: initialData.customer_email,
        customer_phone: initialData.customer_phone || '',
        appointment_date: initialData.appointment_date,
        start_time: initialData.start_time,
        end_time: initialData.end_time,
        service_type: initialData.service_type,
        notes: initialData.notes
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = 'Invalid email format';
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Date is required';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Service type is required';
    }

    if (formData.appointment_date && formData.start_time && formData.end_time) {
      const timeError = validateAppointmentTime(
        formData.appointment_date,
        formData.start_time,
        formData.end_time
      );

      if (timeError) {
        newErrors.time = timeError;
      } else {
        const hasConflict = hasAppointmentConflict(
          {
            date: formData.appointment_date,
            start_time: formData.start_time,
            end_time: formData.end_time
          },
          existingAppointments,
          initialData?.id
        );

        if (hasConflict) {
          newErrors.time = 'This time slot conflicts with an existing appointment';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save appointment' });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.customer_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Smith"
          />
          {errors.customer_name && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email *
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.customer_email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {errors.customer_email && (
            <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            id="customer_phone"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="555-0100"
          />
        </div>

        <div>
          <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline w-4 h-4 mr-1" />
            Service Type *
          </label>
          <select
            id="service_type"
            name="service_type"
            value={formData.service_type}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.service_type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a service</option>
            {SERVICE_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.service_type && (
            <p className="mt-1 text-sm text-red-600">{errors.service_type}</p>
          )}
        </div>

        <div>
          <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date *
          </label>
          <input
            type="date"
            id="appointment_date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.appointment_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.appointment_date && (
            <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Start Time *
            </label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.start_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.start_time && (
              <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
              End Time *
            </label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.end_time ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.end_time && (
              <p className="mt-1 text-sm text-red-600">{errors.end_time}</p>
            )}
          </div>
        </div>
      </div>

      {errors.time && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.time}</p>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline w-4 h-4 mr-1" />
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any special requirements or additional information..."
        />
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Appointment' : 'Book Appointment'}
        </button>
      </div>
    </form>
  );
}
