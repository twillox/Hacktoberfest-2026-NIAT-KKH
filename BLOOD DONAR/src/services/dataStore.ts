import {
  BloodBank,
  DonorProfile,
  EmergencyRequest,
  EmergencyResponse,
  NotificationJob,
  AuditEvent,
  UserAccount,
  BloodGroup,
} from '../types';
import { calculateHaversineDistanceKm } from '../lib/matching';

const STORAGE_KEY_PREFIX = 'bloodbridge_';

// Initial Demo Users
export const DEMO_USERS: Record<string, UserAccount> = {
  'user_ajit': {
    userId: 'user_ajit',
    displayName: 'Ajit',
    email: 'ajit.patnaik@example.com',
    phoneNumber: '+91 98765 43210',
    phoneVerified: true,
    roles: ['requester'],
    avatarInitials: 'AJ',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-10-12T06:00:00Z',
    accountStatus: 'active',
  },
  'user_priya': {
    userId: 'user_priya',
    displayName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phoneNumber: '+91 94370 11223',
    phoneVerified: true,
    roles: ['donor'],
    avatarInitials: 'PS',
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-12T06:00:00Z',
    accountStatus: 'active',
  },
  'user_coordinator': {
    userId: 'user_coordinator',
    displayName: 'Dr. K. Rao',
    email: 'coordinator@bloodbridge.org',
    phoneNumber: '+91 94371 99887',
    phoneVerified: true,
    roles: ['coordinator', 'admin'],
    avatarInitials: 'KR',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-10-12T06:00:00Z',
    accountStatus: 'active',
  },
};

// Seed Blood Banks (Sample Verified Facilities)
export const SEED_BLOOD_BANKS: BloodBank[] = [
  {
    bloodBankId: 'bb_redcross_bbsr',
    name: 'Red Cross Central Blood Bank',
    facilityType: 'Regional Blood Transfusion Centre',
    address: 'Major HQS, Unit IV, Bhouma Nagar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.2724,
    longitude: 85.8338,
    verifiedContact: 'Dr. Sujata Mishra (In-charge)',
    contactNumber: '+91 674 239 1234',
    dataSource: 'State Blood Transfusion Council (Sample/Demo)',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-10-10T10:00:00Z',
    inventory: {
      'O+': { units: 14, lastUpdated: '2026-10-12T08:30:00Z', status: 'available' },
      'O-': { units: 2, lastUpdated: '2026-10-12T08:30:00Z', status: 'low' },
      'A+': { units: 18, lastUpdated: '2026-10-12T08:30:00Z', status: 'available' },
      'A-': { units: 4, lastUpdated: '2026-10-12T08:30:00Z', status: 'available' },
      'B+': { units: 22, lastUpdated: '2026-10-12T08:30:00Z', status: 'available' },
      'B-': { units: 3, lastUpdated: '2026-10-12T08:30:00Z', status: 'low' },
      'AB+': { units: 9, lastUpdated: '2026-10-12T08:30:00Z', status: 'available' },
      'AB-': { units: 1, lastUpdated: '2026-10-12T08:30:00Z', status: 'critical' },
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-12T08:30:00Z',
  },
  {
    bloodBankId: 'bb_capital_hosp',
    name: 'Capital Hospital Blood Centre',
    facilityType: 'Government District Hospital',
    address: 'Unit 6, Near AG Square',
    city: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.2642,
    longitude: 85.8281,
    verifiedContact: 'Emergency Blood Desk',
    contactNumber: '+91 674 239 1983',
    dataSource: 'Government Health Portal (Sample/Demo)',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-10-11T14:00:00Z',
    inventory: {
      'O+': { units: 8, lastUpdated: '2026-10-12T07:15:00Z', status: 'available' },
      'O-': { units: 0, lastUpdated: '2026-10-12T07:15:00Z', status: 'critical' },
      'A+': { units: 11, lastUpdated: '2026-10-12T07:15:00Z', status: 'available' },
      'B+': { units: 15, lastUpdated: '2026-10-12T07:15:00Z', status: 'available' },
      'B-': { units: 2, lastUpdated: '2026-10-12T07:15:00Z', status: 'low' },
      'AB+': { units: 6, lastUpdated: '2026-10-12T07:15:00Z', status: 'available' },
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-12T07:15:00Z',
  },
  {
    bloodBankId: 'bb_aiims_bbsr',
    name: 'AIIMS Bhubaneswar Blood Bank',
    facilityType: 'Tertiary Academic Health Institute',
    address: 'Sijua, Patrapada',
    city: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.2285,
    longitude: 85.7766,
    verifiedContact: 'Transfusion Medicine Dept',
    contactNumber: '+91 674 247 6789',
    dataSource: 'AIIMS Transfusion Medicine (Sample/Demo)',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-10-12T06:00:00Z',
    inventory: {
      'O+': { units: 25, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'O-': { units: 5, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'A+': { units: 19, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'A-': { units: 4, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'B+': { units: 30, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'B-': { units: 6, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'AB+': { units: 12, lastUpdated: '2026-10-12T09:00:00Z', status: 'available' },
      'AB-': { units: 3, lastUpdated: '2026-10-12T09:00:00Z', status: 'low' },
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-12T09:00:00Z',
  },
  {
    bloodBankId: 'bb_apollo_bbsr',
    name: 'Apollo Hospitals Blood Centre',
    facilityType: 'Super-specialty Hospital Blood Bank',
    address: 'Plot No. 251, Sainik School Road, Doordarshan Colony',
    city: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.3087,
    longitude: 85.8341,
    verifiedContact: '24/7 Blood Bank Helpline',
    contactNumber: '+91 674 666 1066',
    dataSource: 'Partner Hospital Registry (Sample/Demo)',
    verificationStatus: 'partner',
    lastVerifiedAt: '2026-10-11T18:00:00Z',
    inventory: {
      'O+': { units: 12, lastUpdated: '2026-10-12T08:00:00Z', status: 'available' },
      'O-': { units: 3, lastUpdated: '2026-10-12T08:00:00Z', status: 'low' },
      'B+': { units: 14, lastUpdated: '2026-10-12T08:00:00Z', status: 'available' },
      'A+': { units: 10, lastUpdated: '2026-10-12T08:00:00Z', status: 'available' },
    },
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-12T08:00:00Z',
  },
  {
    bloodBankId: 'bb_kims_bbsr',
    name: 'KIMS Hospital Blood Centre',
    facilityType: 'Medical College & Hospital Blood Bank',
    address: 'KIIT Campus 5, Patia',
    city: 'Bhubaneswar',
    state: 'Odisha',
    latitude: 20.3541,
    longitude: 85.8192,
    verifiedContact: 'Transfusion Unit',
    contactNumber: '+91 674 710 5300',
    dataSource: 'KIMS Medical Registry (Sample/Demo)',
    verificationStatus: 'partner',
    lastVerifiedAt: '2026-10-12T07:45:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-10-12T07:45:00Z',
  },
];

// Seed Registered Potential Donors (Kept Private / Masked)
export const SEED_DONORS: DonorProfile[] = [
  {
    userId: 'user_priya',
    displayName: 'Priya S.',
    bloodGroup: 'O+',
    city: 'Bhubaneswar',
    locality: 'Saheed Nagar',
    approximateLocation: { latitude: 20.2882, longitude: 85.8451 },
    preferredTravelRadiusKm: 15,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: true, sms: false },
    emergencyAlertConsent: true,
    consentUpdatedAt: '2026-09-01T10:00:00Z',
    profileVerificationStatus: 'phone_verified',
    lastUpdatedAt: '2026-10-10T12:00:00Z',
  },
  {
    userId: 'donor_rahul_v',
    displayName: 'Rahul V.',
    bloodGroup: 'B+',
    city: 'Bhubaneswar',
    locality: 'Nayapalli',
    approximateLocation: { latitude: 20.2974, longitude: 85.8189 },
    preferredTravelRadiusKm: 10,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: false, sms: true },
    emergencyAlertConsent: true,
    consentUpdatedAt: '2026-08-10T09:00:00Z',
    profileVerificationStatus: 'donor_card_verified',
    lastUpdatedAt: '2026-10-11T15:00:00Z',
  },
  {
    userId: 'donor_sneha_m',
    displayName: 'Sneha M.',
    bloodGroup: 'A+',
    city: 'Bhubaneswar',
    locality: 'Chandrasekharpur',
    approximateLocation: { latitude: 20.3256, longitude: 85.8174 },
    preferredTravelRadiusKm: 20,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: true, sms: true },
    emergencyAlertConsent: true,
    consentUpdatedAt: '2026-07-20T11:00:00Z',
    profileVerificationStatus: 'phone_verified',
    lastUpdatedAt: '2026-10-09T08:00:00Z',
  },
  {
    userId: 'donor_amit_m',
    displayName: 'Amit M.',
    bloodGroup: 'O-',
    city: 'Bhubaneswar',
    locality: 'Khandagiri',
    approximateLocation: { latitude: 20.2589, longitude: 85.7825 },
    preferredTravelRadiusKm: 25,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: true, sms: false },
    emergencyAlertConsent: true,
    consentUpdatedAt: '2026-09-15T14:00:00Z',
    profileVerificationStatus: 'donor_card_verified',
    lastUpdatedAt: '2026-10-12T05:00:00Z',
  },
  {
    userId: 'donor_deepa_n',
    displayName: 'Deepa N.',
    bloodGroup: 'AB+',
    city: 'Bhubaneswar',
    locality: 'Patia',
    approximateLocation: { latitude: 20.3582, longitude: 85.8159 },
    preferredTravelRadiusKm: 12,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: true, sms: true },
    emergencyAlertConsent: true,
    consentUpdatedAt: '2026-08-30T16:00:00Z',
    profileVerificationStatus: 'phone_verified',
    lastUpdatedAt: '2026-10-11T11:00:00Z',
  },
];

// Seed Initial Emergency for live demonstration
export const SEED_EMERGENCIES: EmergencyRequest[] = [
  {
    emergencyId: 'em_bbsr_901',
    requesterId: 'user_ajit',
    requesterName: 'Ajit',
    requesterContactReference: '+91 98*** ****10',
    bloodGroup: 'B+',
    unitsRequired: 2,
    hospitalName: 'Apollo Hospitals Bhubaneswar',
    hospitalAddress: 'Plot No. 251, Sainik School Road',
    city: 'Bhubaneswar',
    locality: 'Sainik School Road',
    approximateLocation: { latitude: 20.3087, longitude: 85.8341 },
    urgency: 'critical',
    patientInformationSharedConsent: true,
    status: 'active',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    potentialMatchesCount: 3,
    responsesCount: 2,
    interestedCount: 1,
  },
];

export const SEED_RESPONSES: EmergencyResponse[] = [
  {
    responseId: 'resp_priya_901',
    emergencyId: 'em_bbsr_901',
    donorId: 'user_priya',
    donorNameMasked: 'Priya S.',
    donorBloodGroup: 'O+',
    distanceKm: 3.2,
    responseStatus: 'interested',
    notificationStatus: 'delivered',
    notifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    screeningStatus: 'passed',
    coordinatorReviewStatus: 'accepted',
    secureToken: 'sec_tok_priya_demo',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    responseId: 'resp_rahul_901',
    emergencyId: 'em_bbsr_901',
    donorId: 'donor_rahul_v',
    donorNameMasked: 'Rahul V.',
    donorBloodGroup: 'B+',
    distanceKm: 4.5,
    responseStatus: 'invited',
    notificationStatus: 'sent',
    notifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    screeningStatus: 'not_started',
    coordinatorReviewStatus: 'pending',
    secureToken: 'sec_tok_rahul_demo',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
];

export const SEED_AUDIT_LOGS: AuditEvent[] = [
  {
    eventId: 'audit_init_1',
    userId: 'user_ajit',
    userName: 'Ajit (Requester)',
    action: 'EMERGENCY_CREATED',
    resourceType: 'emergencies',
    resourceId: 'em_bbsr_901',
    details: { bloodGroup: 'B+', units: 2, hospital: 'Apollo Hospitals' },
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    eventId: 'audit_init_2',
    userId: 'system_matching',
    userName: 'Backend Matching Engine',
    action: 'MATCHING_BATCH_NOTIFIED',
    resourceType: 'notificationJobs',
    resourceId: 'em_bbsr_901',
    details: { matchedCount: 2, channels: ['whatsapp'] },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    eventId: 'audit_init_3',
    userId: 'user_priya',
    userName: 'Priya S. (Donor)',
    action: 'DONOR_INTERESTED_SUBMITTED',
    resourceType: 'emergencyResponses',
    resourceId: 'resp_priya_901',
    details: { screeningStatus: 'passed' },
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

/**
 * Reactive Client Data Store with localStorage persistence for out-of-the-box local demo
 */
class BloodBridgeDataStore {
  private currentUser: UserAccount = DEMO_USERS['user_ajit'];
  private users: Record<string, UserAccount> = { ...DEMO_USERS };
  private donors: DonorProfile[] = [...SEED_DONORS];
  private bloodBanks: BloodBank[] = [...SEED_BLOOD_BANKS];
  private emergencies: EmergencyRequest[] = [...SEED_EMERGENCIES];
  private responses: EmergencyResponse[] = [...SEED_RESPONSES];
  private auditLogs: AuditEvent[] = [...SEED_AUDIT_LOGS];
  private subscribers: (() => void)[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedEmergencies = localStorage.getItem(STORAGE_KEY_PREFIX + 'emergencies');
      if (storedEmergencies) {
        this.emergencies = JSON.parse(storedEmergencies);
      }
      const storedResponses = localStorage.getItem(STORAGE_KEY_PREFIX + 'responses');
      if (storedResponses) {
        this.responses = JSON.parse(storedResponses);
      }
      const storedDonors = localStorage.getItem(STORAGE_KEY_PREFIX + 'donors');
      if (storedDonors) {
        this.donors = JSON.parse(storedDonors);
      }
      const storedCurrentUserId = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user_id');
      if (storedCurrentUserId && this.users[storedCurrentUserId]) {
        this.currentUser = this.users[storedCurrentUserId];
      }
    } catch {
      // Local storage not accessible
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'emergencies', JSON.stringify(this.emergencies));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'responses', JSON.stringify(this.responses));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'donors', JSON.stringify(this.donors));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user_id', this.currentUser.userId);
    } catch {
      // Silently handle
    }
    this.notifySubscribers();
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb());
  }

  // --- Auth & Users ---
  getCurrentUser(): UserAccount {
    return this.currentUser;
  }

  setCurrentUser(userId: string) {
    if (this.users[userId]) {
      this.currentUser = this.users[userId];
      this.persist();
    }
  }

  updateUserProfile(updates: Partial<UserAccount>) {
    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users[this.currentUser.userId] = this.currentUser;
    this.persist();
  }

  // --- Donors ---
  getDonors(): DonorProfile[] {
    return [...this.donors];
  }

  getDonorByUserId(userId: string): DonorProfile | undefined {
    return this.donors.find(d => d.userId === userId);
  }

  saveDonorProfile(profile: DonorProfile) {
    const existingIndex = this.donors.findIndex(d => d.userId === profile.userId);
    if (existingIndex >= 0) {
      this.donors[existingIndex] = profile;
    } else {
      this.donors.push(profile);
    }
    // ensure current user has 'donor' role
    if (this.currentUser.userId === profile.userId && !this.currentUser.roles.includes('donor')) {
      this.currentUser.roles.push('donor');
      this.users[this.currentUser.userId] = this.currentUser;
    }
    this.recordAudit({
      action: 'DONOR_PROFILE_UPDATED',
      resourceType: 'donorProfiles',
      resourceId: profile.userId,
      details: { bloodGroup: profile.bloodGroup, status: profile.availabilityStatus },
    });
    this.persist();
  }

  // --- Blood Banks ---
  getBloodBanks(userLat?: number, userLon?: number): BloodBank[] {
    const list = this.bloodBanks.map(bb => {
      if (userLat !== undefined && userLon !== undefined) {
        const distanceKm = calculateHaversineDistanceKm(userLat, userLon, bb.latitude, bb.longitude);
        return { ...bb, distanceKm };
      }
      return bb;
    });

    if (userLat !== undefined && userLon !== undefined) {
      list.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }
    return list;
  }

  // --- Emergencies ---
  getEmergencies(): EmergencyRequest[] {
    return [...this.emergencies];
  }

  getEmergencyById(id: string): EmergencyRequest | undefined {
    return this.emergencies.find(e => e.emergencyId === id);
  }

  createEmergency(req: Omit<EmergencyRequest, 'emergencyId' | 'createdAt' | 'updatedAt' | 'expiresAt' | 'status'>): EmergencyRequest {
    const now = new Date();
    const emergencyId = `em_${Date.now()}`;
    const newEmergency: EmergencyRequest = {
      ...req,
      emergencyId,
      status: 'active',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      responsesCount: 0,
      interestedCount: 0,
    };

    this.emergencies.unshift(newEmergency);
    this.recordAudit({
      action: 'EMERGENCY_REQUEST_SUBMITTED',
      resourceType: 'emergencies',
      resourceId: emergencyId,
      details: {
        bloodGroup: req.bloodGroup,
        units: req.unitsRequired,
        hospital: req.hospitalName,
      },
    });

    this.persist();
    return newEmergency;
  }

  updateEmergencyStatus(emergencyId: string, status: EmergencyRequest['status'], cancellationReason?: string) {
    const item = this.emergencies.find(e => e.emergencyId === emergencyId);
    if (item) {
      item.status = status;
      if (cancellationReason) {
        item.cancellationReason = cancellationReason;
      }
      item.updatedAt = new Date().toISOString();
      this.recordAudit({
        action: `EMERGENCY_STATUS_${status.toUpperCase()}`,
        resourceType: 'emergencies',
        resourceId: emergencyId,
        details: { status, cancellationReason },
      });
      this.persist();
    }
  }

  // --- Responses ---
  getResponsesForEmergency(emergencyId: string): EmergencyResponse[] {
    return this.responses.filter(r => r.emergencyId === emergencyId);
  }

  getResponsesForDonor(donorId: string): EmergencyResponse[] {
    return this.responses.filter(r => r.donorId === donorId);
  }

  getResponseById(responseId: string): EmergencyResponse | undefined {
    return this.responses.find(r => r.responseId === responseId);
  }

  createEmergencyResponse(response: EmergencyResponse) {
    this.responses.unshift(response);
    const em = this.emergencies.find(e => e.emergencyId === response.emergencyId);
    if (em) {
      em.responsesCount = (em.responsesCount || 0) + 1;
    }
    this.persist();
  }

  updateResponseStatus(
    responseId: string,
    status: EmergencyResponse['responseStatus'],
    screeningStatus?: EmergencyResponse['screeningStatus']
  ) {
    const resp = this.responses.find(r => r.responseId === responseId);
    if (resp) {
      resp.responseStatus = status;
      resp.respondedAt = new Date().toISOString();
      resp.updatedAt = new Date().toISOString();
      if (screeningStatus) {
        resp.screeningStatus = screeningStatus;
      }

      const em = this.emergencies.find(e => e.emergencyId === resp.emergencyId);
      if (em) {
        if (status === 'interested') {
          em.interestedCount = (em.interestedCount || 0) + 1;
        }
      }

      this.recordAudit({
        action: `DONOR_RESPONSE_${status.toUpperCase()}`,
        resourceType: 'emergencyResponses',
        resourceId: responseId,
        details: { status, screeningStatus },
      });

      this.persist();
    }
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditEvent[] {
    return [...this.auditLogs];
  }

  recordAudit(event: Omit<AuditEvent, 'eventId' | 'userId' | 'userName' | 'timestamp'>) {
    const newEvent: AuditEvent = {
      ...event,
      eventId: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: this.currentUser.userId,
      userName: `${this.currentUser.displayName} (${this.currentUser.roles.join(', ')})`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(newEvent);
  }

  // Reset demo state
  resetAll() {
    localStorage.clear();
    this.currentUser = DEMO_USERS['user_ajit'];
    this.users = { ...DEMO_USERS };
    this.donors = [...SEED_DONORS];
    this.bloodBanks = [...SEED_BLOOD_BANKS];
    this.emergencies = [...SEED_EMERGENCIES];
    this.responses = [...SEED_RESPONSES];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.persist();
  }
}

export const dataStore = new BloodBridgeDataStore();
