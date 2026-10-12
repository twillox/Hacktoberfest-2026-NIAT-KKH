import { BloodGroup, DonorProfile, EmergencyRequest } from '../types';

/**
 * Standard Red Blood Cell (RBC) compatibility table:
 * Recipient blood group -> list of compatible donor blood groups
 */
export const RBC_COMPATIBILITY_MAP: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
};

/**
 * Check if donor blood group is compatible with recipient
 */
export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const compatible = RBC_COMPATIBILITY_MAP[recipientGroup];
  return compatible ? compatible.includes(donorGroup) : false;
}

/**
 * Calculate distance in kilometers using the Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchedDonorCandidate {
  donor: DonorProfile;
  distanceKm: number;
  isExactGroupMatch: boolean;
  priorityScore: number;
}

export interface MatchOptions {
  maxRadiusKm?: number;
  maxCandidates?: number;
  stagedBatchLimit?: number;
}

/**
 * Find and rank matching donors for an emergency request
 */
export function matchDonorsForEmergency(
  emergency: EmergencyRequest,
  allDonors: DonorProfile[],
  options: MatchOptions = {}
): MatchedDonorCandidate[] {
  const maxRadiusKm = options.maxRadiusKm ?? 30;
  const maxCandidates = options.maxCandidates ?? 10;

  const candidates: MatchedDonorCandidate[] = [];

  for (const donor of allDonors) {
    // 1. Consent check: must have actively consented to emergency alerts
    if (!donor.emergencyAlertConsent) continue;

    // 2. Availability check: must be active/available
    if (donor.availabilityStatus !== 'available') continue;

    // 3. Blood group compatibility check
    if (!isBloodCompatible(donor.bloodGroup, emergency.bloodGroup)) continue;

    // 4. Distance calculation
    const distanceKm = calculateHaversineDistanceKm(
      emergency.approximateLocation.latitude,
      emergency.approximateLocation.longitude,
      donor.approximateLocation.latitude,
      donor.approximateLocation.longitude
    );

    // 5. Check donor's preferred travel radius and search limit
    const allowedRadius = Math.min(donor.preferredTravelRadiusKm || 15, maxRadiusKm);
    if (distanceKm > allowedRadius) continue;

    const isExact = donor.bloodGroup === emergency.bloodGroup;

    // Priority scoring: lower is better (distance + exact match bonus)
    // Exact group match gets a 5km virtual boost in priority
    const priorityScore = distanceKm - (isExact ? 5 : 0);

    candidates.push({
      donor,
      distanceKm,
      isExactGroupMatch: isExact,
      priorityScore,
    });
  }

  // Sort by priority score (ascending), then distance
  candidates.sort((a, b) => a.priorityScore - b.priorityScore);

  return candidates.slice(0, maxCandidates);
}
