export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          appointment_date: string
          start_time: string
          end_time: string
          service_type: string
          notes: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          appointment_date: string
          start_time: string
          end_time: string
          service_type: string
          notes?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          appointment_date?: string
          start_time?: string
          end_time?: string
          service_type?: string
          notes?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
