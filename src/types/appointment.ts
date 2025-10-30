export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface AppointmentFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  notes: string;
}
