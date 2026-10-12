import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { filterAndRankDonors } from './matching';
import { verifyWebhookSignature } from './whatsapp';
import { parseEmergencyWithGemini } from './ai';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function: Create Emergency Request & Dispatch Matching Batch
 */
export const createEmergency = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be signed in.');
  }

  const { bloodGroup, unitsRequired, hospitalName, locality, city, urgency, lat, lon } = data;

  const emergencyRef = db.collection('emergencies').doc();
  const emergencyData = {
    emergencyId: emergencyRef.id,
    requesterId: context.auth.uid,
    bloodGroup,
    unitsRequired: unitsRequired || 1,
    hospitalName,
    locality,
    city,
    urgency: urgency || 'high',
    approximateLocation: { latitude: lat, longitude: lon },
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  await emergencyRef.set(emergencyData);

  // Retrieve candidate donors for matching
  const donorsSnapshot = await db
    .collection('donorProfiles')
    .where('availabilityStatus', '==', 'available')
    .where('emergencyAlertConsent', '==', true)
    .limit(50)
    .get();

  const donors = donorsSnapshot.docs.map(doc => doc.data() as any);
  const matched = filterAndRankDonors(emergencyData as any, donors, 25, 5);

  return {
    success: true,
    emergencyId: emergencyRef.id,
    matchedCandidatesCount: matched.length,
  };
});

/**
 * Cloud Function: WhatsApp Incoming Webhook HTTP Endpoint
 */
export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    // Webhook verification challenge
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'bloodbridge_webhook_verify_secure_token';

    if (mode === 'subscribe' && token === verifyToken) {
      res.status(200).send(challenge);
      return;
    }
    res.status(403).send('Forbidden');
    return;
  }

  if (req.method === 'POST') {
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    if (appSecret && !verifyWebhookSignature(JSON.stringify(req.body), signature, appSecret)) {
      res.status(401).send('Invalid signature');
      return;
    }

    // Process incoming message or delivery status
    res.status(200).json({ status: 'success' });
  }
});
