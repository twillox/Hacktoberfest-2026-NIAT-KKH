import { describe, it, expect } from 'vitest';
import { mockGemmaExtract, parseBloodGroupFromText } from '../src/lib/gemma';
import {
  buildEmergencyInvitationTemplate,
  verifyWhatsAppWebhookSignature,
} from '../src/lib/whatsapp';
import { DonorProfile, EmergencyRequest } from '../src/types';

describe('Gemma 4 Structured Intake Parser', () => {
  it('correctly extracts blood group from various natural language phrases', () => {
    expect(parseBloodGroupFromText('need b positive blood')).toBe('B+');
    expect(parseBloodGroupFromText('patient needs o-negative immediately')).toBe('O-');
    expect(parseBloodGroupFromText('require AB+ blood units')).toBe('AB+');
    expect(parseBloodGroupFromText('A negative donor required')).toBe('A-');
  });

  it('extracts units, hospital, and urgency from full sentence input', () => {
    const text = 'We urgently need 2 units of B-positive blood at Apollo Hospital in Bhubaneswar.';
    const result = mockGemmaExtract(text);

    expect(result.bloodGroup).toBe('B+');
    expect(result.unitsRequired).toBe(2);
    expect(result.hospitalName).toContain('Apollo Hospital');
    expect(result.urgency).toBe('critical');
    expect(result.confidenceScore).toBeGreaterThan(0.9);
  });
});

describe('WhatsApp Integration & Webhook Security', () => {
  const dummyDonor: DonorProfile = {
    userId: 'd_1',
    displayName: 'Priya S.',
    bloodGroup: 'O+',
    city: 'Bhubaneswar',
    approximateLocation: { latitude: 20.28, longitude: 85.84 },
    preferredTravelRadiusKm: 15,
    availabilityStatus: 'available',
    notificationPreferences: { whatsapp: true, push: true, sms: false },
    emergencyAlertConsent: true,
    consentUpdatedAt: new Date().toISOString(),
    profileVerificationStatus: 'phone_verified',
    lastUpdatedAt: new Date().toISOString(),
  };

  const dummyEmergency: EmergencyRequest = {
    emergencyId: 'em_1',
    requesterId: 'req_1',
    bloodGroup: 'B+',
    unitsRequired: 1,
    hospitalName: 'Capital Hospital',
    hospitalAddress: 'Unit 6',
    city: 'Bhubaneswar',
    locality: 'Unit 6',
    approximateLocation: { latitude: 20.26, longitude: 85.82 },
    urgency: 'critical',
    patientInformationSharedConsent: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiresAt: new Date().toISOString(),
  };

  it('builds standard approved WhatsApp template without leaking patient identity', () => {
    const secureUrl = 'https://bloodbridge.org/invitation/sec_123';
    const { templateName, messageText } = buildEmergencyInvitationTemplate(
      dummyDonor,
      dummyEmergency,
      secureUrl
    );

    expect(templateName).toBe('bloodbridge_emergency_alert_v1');
    expect(messageText).toContain('B+');
    expect(messageText).toContain('Capital Hospital');
    expect(messageText).toContain(secureUrl);
    expect(messageText).not.toContain('patient name');
  });

  it('validates webhook signatures correctly', () => {
    const valid = verifyWhatsAppWebhookSignature(
      JSON.stringify({ status: 'delivered' }),
      'sha256=abcdef1234567890',
      'demo_secret'
    );
    expect(valid).toBe(true);

    const invalid = verifyWhatsAppWebhookSignature(
      JSON.stringify({ status: 'delivered' }),
      'invalid_header',
      'demo_secret'
    );
    expect(invalid).toBe(false);
  });
});
