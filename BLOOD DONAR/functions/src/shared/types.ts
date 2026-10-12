export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Urgency = 'critical' | 'high' | 'moderate';
export type EmergencyStatus = 'active' | 'in_progress' | 'fulfilled' | 'cancelled' | 'expired';

export interface DonorProfileData {
  userId: string;
  bloodGroup: BloodGroup;
  approximateLocation: { latitude: number; longitude: number };
  preferredTravelRadiusKm: number;
  availabilityStatus: 'available' | 'paused' | 'temporarily_ineligible';
  emergencyAlertConsent: boolean;
  phoneNumber?: string;
}

export interface EmergencyData {
  emergencyId: string;
  requesterId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  approximateLocation: { latitude: number; longitude: number };
  urgency: Urgency;
  status: EmergencyStatus;
  createdAt: string;
}
