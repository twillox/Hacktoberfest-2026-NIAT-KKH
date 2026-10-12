import React, { useState } from 'react';
import { X, CheckCheck, ExternalLink, Shield, Send, PhoneCall } from 'lucide-react';
import { notificationService } from '../../lib/whatsapp';
import { dataStore } from '../../services/dataStore';
import { useNavigate } from 'react-router-dom';

interface WhatsAppSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const jobs = notificationService.getJobs();
  const latestJob = jobs[0];
  const [activeTab, setActiveTab] = useState<'message' | 'webhookLog'>('message');

  if (!isOpen) return null;

  const currentEmergency = latestJob
    ? dataStore.getEmergencyById(latestJob.emergencyId)
    : dataStore.getEmergencies()[0];

  const handleSimulateResponse = (decision: 'interested' | 'declined') => {
    if (!currentEmergency) return;
    
    // Find or simulate corresponding response
    const responses = dataStore.getResponsesForEmergency(currentEmergency.emergencyId);
    if (responses.length > 0) {
      const resp = responses[0];
      dataStore.updateResponseStatus(resp.responseId, decision);
      notificationService.updateJobStatus(latestJob?.jobId || 'demo', 'delivered');
      
      if (decision === 'interested') {
        onClose();
        navigate(`/donor/invitation/${resp.responseId}/screening`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#EFEAE2] max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-300 flex flex-col max-h-[90vh]">
        
        {/* WhatsApp Top Bar Header */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-crimson-600 font-bold text-xs shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-crimson-600 inline-block mr-0.5" /> BB
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                BloodBridge Alerts
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                  ✓
                </span>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>Verified Business Account</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="bg-[#128C7E] px-4 py-1.5 flex gap-4 text-xs font-medium text-emerald-100">
          <button
            onClick={() => setActiveTab('message')}
            className={`pb-0.5 border-b-2 transition-all ${
              activeTab === 'message' ? 'border-white text-white font-bold' : 'border-transparent text-emerald-200'
            }`}
          >
            WhatsApp Client UI
          </button>
          <button
            onClick={() => setActiveTab('webhookLog')}
            className={`pb-0.5 border-b-2 transition-all ${
              activeTab === 'webhookLog' ? 'border-white text-white font-bold' : 'border-transparent text-emerald-200'
            }`}
          >
            Server Webhook Stream
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {activeTab === 'message' ? (
            <>
              {/* Timestamp bubble */}
              <div className="flex justify-center">
                <span className="bg-white/80 text-stone-600 text-[10px] px-2.5 py-0.5 rounded-md shadow-xs">
                  TODAY
                </span>
              </div>

              {/* Security info disclaimer */}
              <div className="bg-[#FFEECD] text-[#544F44] text-[11px] p-2.5 rounded-lg shadow-xs text-center border border-[#F3DEB0] flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>
                  Messages and calls are end-to-end encrypted. Official template validated.
                </span>
              </div>

              {/* Message Bubble */}
              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm border border-stone-200 text-stone-900 text-xs leading-relaxed space-y-2">
                <div className="font-semibold text-crimson-700 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
                  <span className="w-2 h-2 rounded-full bg-crimson-600 animate-pulse" />
                  EMERGENCY BLOOD DONATION REQUEST
                </div>

                <p className="whitespace-pre-line text-stone-800">
                  {latestJob?.messagePreview || (
                    `BloodBridge: A blood donation request needs attention near your area.\n` +
                    `• Blood group needed: ${currentEmergency?.bloodGroup || 'B+'}\n` +
                    `• Facility: ${currentEmergency?.hospitalName || 'Apollo Hospitals, Bhubaneswar'}\n` +
                    `• Urgency: ${(currentEmergency?.urgency || 'CRITICAL').toUpperCase()}\n\n` +
                    `If you are able and interested, tap the secure link below to review details:\n` +
                    `https://bloodbridge.org/donor/invitation/demo?token=sec_901\n\n` +
                    `Reply STOP to pause alerts at any time.`
                  )}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-0.5 text-blue-500 font-medium">
                    <CheckCheck className="w-3.5 h-3.5" /> Read
                  </span>
                </div>
              </div>

              {/* WhatsApp Interactive Response Buttons */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-semibold text-stone-600 px-1">
                  Simulate Donor WhatsApp Quick Reply:
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulateResponse('interested')}
                    className="py-2.5 px-3 bg-[#075E54] hover:bg-[#128C7E] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>✓ I'm Interested</span>
                  </button>

                  <button
                    onClick={() => handleSimulateResponse('declined')}
                    className="py-2.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>✕ Can't Donate</span>
                  </button>
                </div>

                {currentEmergency && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/emergency/${currentEmergency.emergencyId}`);
                    }}
                    className="w-full py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Emergency Tracking Page</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Webhook Log tab */
            <div className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-[11px] space-y-2 overflow-x-auto">
              <div className="text-emerald-400 font-bold">--- WHATSAPP WEBHOOK EVENT STREAM ---</div>
              <div>[POST] /api/v1/whatsapp/webhook</div>
              <div className="text-stone-400">x-hub-signature-256: sha256=9b7f...valid</div>
              <div className="text-stone-300">
                {JSON.stringify({
                  object: 'whatsapp_business_account',
                  entry: [{
                    id: '10987654321',
                    changes: [{
                      value: {
                        messaging_product: 'whatsapp',
                        metadata: { display_phone_number: '+15551234567' },
                        messages: [{
                          from: '+919437011223',
                          id: latestJob?.providerMessageId || 'wamid.HB_DEMO',
                          type: 'interactive',
                          interactive: { button_reply: { id: 'BTN_INTERESTED', title: "I'm interested" } }
                        }]
                      }
                    }]
                  }],
                }, null, 2)}
              </div>
              <div className="text-emerald-400">Status 200 OK — Idempotent update processed.</div>
            </div>
          )}
        </div>

        {/* Bottom Bar Footer */}
        <div className="bg-[#F0F2F5] px-4 py-2 border-t border-stone-200 text-center text-[11px] text-stone-500">
          Simulated development environment • No real SMS/WhatsApp charges
        </div>
      </div>
    </div>
  );
};
