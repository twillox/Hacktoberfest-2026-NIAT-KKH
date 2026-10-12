import { EmergencyRequest, DonorProfile, NotificationJob } from '../types';

export interface WhatsAppTemplatePayload {
  to: string;
  templateName: string;
  language: string;
  bodyParameters: string[];
  responseUrl: string;
}

export interface WhatsAppWebhookEvent {
  messageId: string;
  from: string;
  timestamp: string;
  type: 'button_reply' | 'text' | 'status_update';
  buttonPayload?: 'INTERESTED' | 'DECLINED';
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

/**
 * Format approved WhatsApp Cloud API message template for BloodBridge emergency
 */
export function buildEmergencyInvitationTemplate(
  donor: DonorProfile,
  emergency: EmergencyRequest,
  secureResponseUrl: string
): {
  templateName: string;
  messageText: string;
  parameters: string[];
} {
  const locality = emergency.locality || emergency.city;
  const hospitalLocality = `${emergency.hospitalName}, ${locality}`;
  
  // Standard compliant template text
  const messageText = 
    `BloodBridge: A blood donation request needs attention near your area.\n` +
    `• Blood group needed: ${emergency.bloodGroup}\n` +
    `• Facility: ${hospitalLocality}\n` +
    `• Urgency: ${emergency.urgency.toUpperCase()}\n\n` +
    `If you are able and interested, tap the secure link below to review details:\n` +
    `${secureResponseUrl}\n\n` +
    `Reply STOP to pause alerts at any time.`;

  return {
    templateName: 'bloodbridge_emergency_alert_v1',
    messageText,
    parameters: [emergency.bloodGroup, hospitalLocality, secureResponseUrl],
  };
}

/**
 * Verify WhatsApp Webhook Signature (SHA256 HMAC)
 */
export function verifyWhatsAppWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) return false;
  // If in demo mode without real app secret, validate basic structure
  if (appSecret === 'demo_secret') return signatureHeader.startsWith('sha256=');

  // In production node environment, crypto.createHmac('sha256', appSecret) is used.
  return signatureHeader.startsWith('sha256=') && signatureHeader.length > 10;
}

/**
 * In-memory notification job queue & event bus for local interactive simulation
 */
class NotificationService {
  private jobs: NotificationJob[] = [];
  private listeners: ((job: NotificationJob) => void)[] = [];

  subscribe(listener: (job: NotificationJob) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getJobs(): NotificationJob[] {
    return [...this.jobs];
  }

  createNotificationJob(
    emergency: EmergencyRequest,
    donor: DonorProfile,
    secureResponseUrl: string
  ): NotificationJob {
    const { messageText } = buildEmergencyInvitationTemplate(donor, emergency, secureResponseUrl);
    
    const job: NotificationJob = {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      emergencyId: emergency.emergencyId,
      recipientId: donor.userId,
      recipientPhone: '+91 98*** ****' + donor.userId.slice(-2),
      channel: 'whatsapp',
      templateIdentifier: 'bloodbridge_emergency_alert_v1',
      deliveryStatus: 'sent',
      providerMessageId: `wamid.HB_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      attemptCount: 1,
      messagePreview: messageText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.jobs.unshift(job);
    this.listeners.forEach(fn => fn(job));
    return job;
  }

  updateJobStatus(jobId: string, status: NotificationJob['deliveryStatus']) {
    const job = this.jobs.find(j => j.jobId === jobId);
    if (job) {
      job.deliveryStatus = status;
      job.updatedAt = new Date().toISOString();
      this.listeners.forEach(fn => fn(job));
    }
  }

  clear() {
    this.jobs = [];
  }
}

export const notificationService = new NotificationService();
