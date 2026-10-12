export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Urgency = 'critical' | 'high' | 'moderate';

export type EmergencyStatus = 'active' | 'in_progress' | 'fulfilled' | 'cancelled' | 'expired';

export type UserRole = 'requester' | 'donor' | 'coordinator' | 'admin';

export interface UserAccount {
  userId: string;
  displayName: string;
  email?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
  accountStatus: 'active' | 'suspended' | 'deleted';
  avatarInitials?: string;
}

export interface DonorProfile {
  userId: string;
  displayName: string;
  bloodGroup: BloodGroup;
  city: string;
  locality?: string;
  approximateLocation: {
    latitude: number;
    longitude: number;
  };
  geohash?: string;
  preferredTravelRadiusKm: number;
  availabilityStatus: 'available' | 'paused' | 'temporarily_ineligible';
  notificationPreferences: {
    whatsapp: boolean;
    push: boolean;
    sms: boolean;
  };
  emergencyAlertConsent: boolean;
  consentUpdatedAt: string;
  profileVerificationStatus: 'unverified' | 'phone_verified' | 'donor_card_verified';
  lastDonationDate?: string;
  lastUpdatedAt: string;
}

export interface BloodBank {
  bloodBankId: string;
  name: string;
  facilityType: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  verifiedContact: string;
  contactNumber: string;
  dataSource: string;
  verificationStatus: 'verified' | 'partner' | 'community_reported';
  lastVerifiedAt: string;
  inventory?: Partial<Record<BloodGroup, {
    units: number;
    lastUpdated: string;
    status: 'available' | 'low' | 'critical' | 'unknown';
  }>>;
  distanceKm?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequest {
  emergencyId: string;
  requesterId: string;
  requesterName?: string;
  requesterContactReference?: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  locality?: string;
  approximateLocation: {
    latitude: number;
    longitude: number;
  };
  urgency: Urgency;
  patientInformationSharedConsent: boolean;
  status: EmergencyStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  cancellationReason?: string;
  potentialMatchesCount?: number;
  responsesCount?: number;
  interestedCount?: number;
}

export interface EmergencyResponse {
  responseId: string;
  emergencyId: string;
  donorId: string;
  donorNameMasked: string;
  donorBloodGroup: BloodGroup;
  distanceKm?: number;
  responseStatus: 'invited' | 'interested' | 'declined' | 'screening_passed' | 'screening_failed' | 'arrived' | 'completed';
  notificationStatus: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  notifiedAt: string;
  respondedAt?: string;
  screeningStatus?: 'not_started' | 'passed' | 'review_required';
  coordinatorReviewStatus?: 'pending' | 'accepted' | 'declined';
  secureToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationJob {
  jobId: string;
  emergencyId: string;
  recipientId: string;
  recipientPhone?: string;
  channel: 'whatsapp' | 'sms' | 'push';
  templateIdentifier: string;
  deliveryStatus: 'queued' | 'sent' | 'delivered' | 'failed';
  providerMessageId?: string;
  attemptCount: number;
  messagePreview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  eventId: string;
  userId: string;
  userName?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Donor preliminary screening questionnaire answer schema
export interface DonorScreeningAnswers {
  donatedPast90Days: boolean;
  feelingWellToday: boolean;
  hasFeverOrInfection: boolean;
  recentTattoosOrPiercing: boolean;
  canTravelToFacility: boolean;
  notes?: string;
}

// Gemma AI Structured Output schema
export interface GemmaExtractedRequest {
  bloodGroup?: BloodGroup;
  unitsRequired?: number;
  hospitalName?: string;
  locality?: string;
  city?: string;
  urgency?: Urgency;
  confidenceScore?: number;
  rawExplanation?: string;
}
