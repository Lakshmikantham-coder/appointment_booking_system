import { supabase } from '../lib/supabase';
import type { Appointment, AppointmentFormData, AppointmentStatus } from '../types/appointment';

export async function getAllAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return data || [];
}

export async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return data || [];
}

export async function createAppointment(
  appointmentData: AppointmentFormData
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      customer_name: appointmentData.customer_name,
      customer_email: appointmentData.customer_email,
      customer_phone: appointmentData.customer_phone || null,
      appointment_date: appointmentData.appointment_date,
      start_time: appointmentData.start_time,
      end_time: appointmentData.end_time,
      service_type: appointmentData.service_type,
      notes: appointmentData.notes || '',
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create appointment: ${error.message}`);
  }

  return data;
}

export async function updateAppointment(
  id: string,
  updates: Partial<AppointmentFormData>
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  return data;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment status: ${error.message}`);
  }

  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
}

export async function getAppointmentsByEmail(email: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_email', email)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return data || [];
}
