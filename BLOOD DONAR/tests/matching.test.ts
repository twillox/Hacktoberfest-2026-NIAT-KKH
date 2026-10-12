import { describe, it, expect } from 'vitest';
import {
  isBloodCompatible,
  calculateHaversineDistanceKm,
  matchDonorsForEmergency,
} from '../src/lib/matching';
import { DonorProfile, EmergencyRequest } from '../src/types';

describe('Blood Compatibility Rules (RBC Matrix)', () => {
  it('identifies O- as universal donor to all groups', () => {
    const allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
    allGroups.forEach((recipient) => {
      expect(isBloodCompatible('O-', recipient)).toBe(true);
    });
  });

  it('restricts O- recipients to only receive from O-', () => {
    expect(isBloodCompatible('O-', 'O-')).toBe(true);
    expect(isBloodCompatible('O+', 'O-')).toBe(false);
    expect(isBloodCompatible('A+', 'O-')).toBe(false);
    expect(isBloodCompatible('B+', 'O-')).toBe(false);
  });

  it('correctly matches B+ recipients with B+, B-, O+, O-', () => {
    expect(isBloodCompatible('B+', 'B+')).toBe(true);
    expect(isBloodCompatible('B-', 'B+')).toBe(true);
    expect(isBloodCompatible('O+', 'B+')).toBe(true);
    expect(isBloodCompatible('O-', 'B+')).toBe(true);
    expect(isBloodCompatible('A+', 'B+')).toBe(false);
    expect(isBloodCompatible('AB+', 'B+')).toBe(false);
  });

  it('allows AB+ recipients to receive from all groups', () => {
    const allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
    allGroups.forEach((donor) => {
      expect(isBloodCompatible(donor, 'AB+')).toBe(true);
    });
  });
});

describe('Geospatial Haversine Calculation', () => {
  it('calculates realistic distance between two Bhubaneswar landmarks', () => {
    // Red Cross Unit 4 (20.2724, 85.8338) and Capital Hospital Unit 6 (20.2642, 85.8281)
    const distance = calculateHaversineDistanceKm(20.2724, 85.8338, 20.2642, 85.8281);
    expect(distance).toBeGreaterThan(0.5);
    expect(distance).toBeLessThan(2.0);
  });

  it('returns 0 for identical coordinates', () => {
    expect(calculateHaversineDistanceKm(20.3, 85.8, 20.3, 85.8)).toBe(0);
  });
});

describe('Donor Matching Engine', () => {
  const mockEmergency: EmergencyRequest = {
    emergencyId: 'em_test_1',
    requesterId: 'req_1',
    bloodGroup: 'B+',
    unitsRequired: 2,
    hospitalName: 'Apollo Hospitals',
    hospitalAddress: 'Sainik School Road',
    city: 'Bhubaneswar',
    approximateLocation: { latitude: 20.3087, longitude: 85.8341 },
    urgency: 'critical',
    patientInformationSharedConsent: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date().toISOString(),
  };

  const mockDonors: DonorProfile[] = [
    {
      userId: 'donor_exact_nearby',
      displayName: 'Rahul',
      bloodGroup: 'B+',
      city: 'Bhubaneswar',
      approximateLocation: { latitude: 20.31, longitude: 85.83 }, // ~1 km
      preferredTravelRadiusKm: 15,
      availabilityStatus: 'available',
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      userId: 'donor_compatible_nearby',
      displayName: 'Priya',
      bloodGroup: 'O+',
      city: 'Bhubaneswar',
      approximateLocation: { latitude: 20.312, longitude: 85.835 }, // ~1 km
      preferredTravelRadiusKm: 15,
      availabilityStatus: 'available',
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      userId: 'donor_no_consent',
      displayName: 'Deepak',
      bloodGroup: 'B+',
      city: 'Bhubaneswar',
      approximateLocation: { latitude: 20.31, longitude: 85.83 },
      preferredTravelRadiusKm: 15,
      availabilityStatus: 'available',
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: false, // NO CONSENT
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      userId: 'donor_paused',
      displayName: 'Anil',
      bloodGroup: 'B+',
      city: 'Bhubaneswar',
      approximateLocation: { latitude: 20.31, longitude: 85.83 },
      preferredTravelRadiusKm: 15,
      availabilityStatus: 'paused', // PAUSED
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      userId: 'donor_incompatible',
      displayName: 'Kavita',
      bloodGroup: 'A+', // INCOMPATIBLE WITH B+
      city: 'Bhubaneswar',
      approximateLocation: { latitude: 20.31, longitude: 85.83 },
      preferredTravelRadiusKm: 15,
      availabilityStatus: 'available',
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      userId: 'donor_too_far',
      displayName: 'Ramesh',
      bloodGroup: 'B+',
      city: 'Cuttack',
      approximateLocation: { latitude: 20.46, longitude: 85.88 }, // ~25 km away, radius is 5km
      preferredTravelRadiusKm: 5, // SMALL RADIUS
      availabilityStatus: 'available',
      notificationPreferences: { whatsapp: true, push: true, sms: false },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    },
  ];

  it('filters out donors without consent, paused donors, incompatible groups, and those beyond radius', () => {
    const matches = matchDonorsForEmergency(mockEmergency, mockDonors);
    expect(matches.length).toBe(2);
    const matchedIds = matches.map((m) => m.donor.userId);
    expect(matchedIds).toContain('donor_exact_nearby');
    expect(matchedIds).toContain('donor_compatible_nearby');
    expect(matchedIds).not.toContain('donor_no_consent');
    expect(matchedIds).not.toContain('donor_paused');
    expect(matchedIds).not.toContain('donor_incompatible');
    expect(matchedIds).not.toContain('donor_too_far');
  });

  it('ranks exact blood group match higher than compatible match of similar distance', () => {
    const matches = matchDonorsForEmergency(mockEmergency, mockDonors);
    expect(matches[0].donor.userId).toBe('donor_exact_nearby');
    expect(matches[0].isExactGroupMatch).toBe(true);
  });
});
