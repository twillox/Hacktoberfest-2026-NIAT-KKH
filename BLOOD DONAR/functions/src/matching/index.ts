import { BloodGroup, DonorProfileData, EmergencyData } from '../shared/types';

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

export function isBloodCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  const compatible = RBC_COMPATIBILITY_MAP[recipientGroup];
  return compatible ? compatible.includes(donorGroup) : false;
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
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

export function filterAndRankDonors(
  emergency: EmergencyData,
  donors: DonorProfileData[],
  maxRadiusKm = 30,
  maxBatchSize = 10
): { donor: DonorProfileData; distanceKm: number }[] {
  const results: { donor: DonorProfileData; distanceKm: number; score: number }[] = [];

  for (const donor of donors) {
    if (!donor.emergencyAlertConsent) continue;
    if (donor.availabilityStatus !== 'available') continue;
    if (!isBloodCompatible(donor.bloodGroup, emergency.bloodGroup)) continue;

    const distanceKm = calculateDistanceKm(
      emergency.approximateLocation.latitude,
      emergency.approximateLocation.longitude,
      donor.approximateLocation.latitude,
      donor.approximateLocation.longitude
    );

    const allowedRadius = Math.min(donor.preferredTravelRadiusKm || 15, maxRadiusKm);
    if (distanceKm > allowedRadius) continue;

    const isExact = donor.bloodGroup === emergency.bloodGroup;
    const score = distanceKm - (isExact ? 5 : 0);

    results.push({ donor, distanceKm, score });
  }

  results.sort((a, b) => a.score - b.score);
  return results.slice(0, maxBatchSize).map(({ donor, distanceKm }) => ({ donor, distanceKm }));
}
