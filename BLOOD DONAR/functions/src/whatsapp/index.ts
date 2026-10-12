import * as crypto from 'crypto';

export interface WhatsAppTemplatePayload {
  to: string;
  templateName: string;
  parameters: string[];
}

export function formatWhatsAppInvitationMessage(
  bloodGroup: string,
  hospitalLocality: string,
  urgency: string,
  secureUrl: string
): string {
  return (
    `BloodBridge: A blood donation request needs attention near your area.\n` +
    `• Blood group: ${bloodGroup}\n` +
    `• Location: ${hospitalLocality}\n` +
    `• Urgency: ${urgency.toUpperCase()}\n\n` +
    `If you are interested, use the secure response link to view the request details:\n` +
    `${secureUrl}\n\n` +
    `Reply STOP to pause alerts.`
  );
}

export function verifyWebhookSignature(
  payloadRaw: string,
  signatureHeader: string | undefined,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) return false;
  const parts = signatureHeader.split('sha256=');
  if (parts.length !== 2) return false;

  const expectedSignature = parts[1];
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(payloadRaw);
  const calculatedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  );
}
