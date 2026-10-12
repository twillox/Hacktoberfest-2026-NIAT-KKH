import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
  CornerDownRight,
  RefreshCw,
} from 'lucide-react';
import { extractEmergencyDetailsWithGemma } from '../../lib/gemma';
import { GemmaExtractedRequest } from '../../types';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();

  const [inputPrompt, setInputPrompt] = useState(
    'Urgent requirement for two units of B-positive blood for patient admitted in ICU at Apollo Hospitals in Bhubaneswar.'
  );
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [modelId, setModelId] = useState(import.meta.env.VITE_GEMMA_MODEL_ID || 'gemma-4-it');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<GemmaExtractedRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const samplePrompts = [
    'Need 1 unit of O-negative blood urgently near Capital Hospital in Unit 6.',
    'Require 2 units of A-positive blood for scheduled surgery tomorrow at AIIMS Bhubaneswar.',
    'Emergency: B-positive blood needed for trauma case at Apollo Hospital.',
  ];

  const handleExtract = async (textToUse?: string) => {
    const text = textToUse || inputPrompt;
    if (!text.trim()) {
      setErrorMsg('Please enter a description to analyze.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await extractEmergencyDetailsWithGemma(text, apiKey);
      setExtractedData(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract structured data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (!extractedData) return;
    const params = new URLSearchParams();
    if (extractedData.bloodGroup) params.set('bloodGroup', extractedData.bloodGroup);
    if (extractedData.unitsRequired) params.set('units', extractedData.unitsRequired.toString());
    if (extractedData.hospitalName) params.set('hospital', extractedData.hospitalName);
    if (extractedData.locality) params.set('locality', extractedData.locality);
    if (extractedData.urgency) params.set('urgency', extractedData.urgency);

    navigate(`/find-blood?${params.toString()}`);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/60">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Gemma 4 AI Assistant</span>
        </h1>

        <div className="w-8" />
      </div>

      {/* Model & Config Pill */}
      <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-purple-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Configured Model: {modelId}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200/70 text-purple-800 font-bold">
            {apiKey ? 'Live API Key' : 'Local Fallback Adapter'}
          </span>
        </div>
        <p className="text-[11px] text-purple-800/80 leading-snug">
          Gemma converts unformatted voice or text emergency pleas into verified structured request fields.
        </p>
      </div>

      {/* Input Box */}
      <div className="space-y-2.5 mb-4">
        <label className="block text-xs font-bold text-stone-800">
          Natural Language Emergency Message
        </label>
        <div className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            rows={3}
            placeholder="Type or paste emergency details..."
            className="w-full p-3 text-xs rounded-2xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-stone-900 shadow-soft-sm leading-relaxed"
          />
        </div>

        {/* Sample chips */}
        <div className="space-y-1">
          <div className="text-[10.5px] font-semibold text-stone-400">Try quick examples:</div>
          <div className="flex flex-col gap-1.5">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputPrompt(sample);
                  handleExtract(sample);
                }}
                className="text-left text-[11px] p-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/70 text-stone-700 transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleExtract()}
          disabled={isLoading}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemma 4...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Extract Structured Fields</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Extracted Schema Preview */}
      {extractedData && (
        <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-soft space-y-3.5 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Extracted Structured Schema
            </span>
            <span className="text-[10px] font-semibold text-stone-400">
              Confidence: {Math.round((extractedData.confidenceScore || 0.95) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Blood Group</div>
              <div className="font-extrabold text-base text-crimson-600 mt-0.5">
                {extractedData.bloodGroup || 'Unspecified'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Units Required</div>
              <div className="font-bold text-stone-800 text-base mt-0.5">
                {extractedData.unitsRequired || 1}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Hospital</div>
              <div className="font-bold text-stone-800 mt-0.5 truncate">
                {extractedData.hospitalName || 'Not specified'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[10px] text-stone-400 font-semibold uppercase">Urgency</div>
              <div className="font-bold uppercase text-stone-800 mt-0.5">
                {extractedData.urgency || 'high'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50 text-[11px] text-purple-900 border border-purple-100">
            {extractedData.rawExplanation}
          </div>

          {/* Transfer to Emergency Form button */}
          <button
            onClick={handleApplyToForm}
            className="w-full py-3 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Request Form with These Details</span>
            <CornerDownRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="mt-4 p-3 rounded-2xl bg-stone-100 text-[10.5px] text-stone-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Safety Policy:</strong> The model assists solely in text parsing. It cannot decide medical priority, diagnose patients, or declare biological compatibility.
        </span>
      </div>
    </div>
  );
};
