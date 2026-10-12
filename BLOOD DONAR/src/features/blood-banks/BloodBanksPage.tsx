import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  List,
  Map as MapIcon,
  Crosshair,
  Building2,
  Info,
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { BloodBank, BloodGroup } from '../../types';

export const BloodBanksPage: React.FC = () => {
  const navigate = useNavigate();

  // Location filter coordinates (defaults to Capital Hospital / Central Bhubaneswar)
  const [userLat, setUserLat] = useState<number>(20.2724);
  const [userLon, setUserLon] = useState<number>(85.8338);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const bloodBanks = dataStore.getBloodBanks(userLat, userLon);

  const filteredBanks = bloodBanks.filter((bank) => {
    const matchesQuery =
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  const handleUseGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLon(pos.coords.longitude);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
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

        <h1 className="text-sm font-extrabold text-stone-900">Nearby Blood Banks</h1>

        {/* View Toggle */}
        <div className="flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1 rounded-md text-xs transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-xs text-crimson-600 font-bold' : 'text-stone-500'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-1 rounded-md text-xs transition-colors ${
              viewMode === 'map' ? 'bg-white shadow-xs text-crimson-600 font-bold' : 'text-stone-500'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input & Location Pin */}
      <div className="space-y-2 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facility name or area..."
            className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900 shadow-soft-sm"
          />
          <button
            onClick={handleUseGPS}
            disabled={isLocating}
            title="Sort from my GPS position"
            className="absolute right-2.5 top-2.5 text-stone-400 hover:text-crimson-600 p-0.5"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-crimson-600' : ''}`} />
          </button>
        </div>

        {/* Blood Group Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
          {(['ALL', 'A+', 'B+', 'O+', 'AB+', 'O-', 'A-', 'B-', 'AB-'] as const).map((group) => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex-shrink-0 transition-all ${
                selectedGroup === group
                  ? 'bg-crimson-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-crimson-200'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Regulatory & Verification Disclaimer */}
      <div className="p-2.5 mb-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-700" />
        <div>
          <span>
            Facilities are sorted by real distance. Inventory counts are advisory. Always call facility before traveling.
          </span>
        </div>
      </div>

      {/* Map View Alternative */}
      {viewMode === 'map' ? (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft-sm mb-4">
          <div className="h-64 bg-stone-100 relative flex items-center justify-center">
            {/* Embedded OpenStreetMap interactive frame */}
            <iframe
              title="Nearby Blood Banks Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=85.75%2C20.20%2C85.88%2C20.38&layer=mapnik&marker=${userLat}%2C${userLon}`}
              className="w-full h-full"
            />
          </div>
          <div className="p-3 text-[11px] text-stone-500 bg-stone-50 border-t border-stone-200 text-center">
            Showing OpenStreetMap geospatial clusters in Bhubaneswar zone
          </div>
        </div>
      ) : null}

      {/* List of Verified Blood Banks */}
      <div className="space-y-3">
        {filteredBanks.map((bank) => {
          const invItem = selectedGroup !== 'ALL' && bank.inventory ? bank.inventory[selectedGroup] : undefined;

          return (
            <div
              key={bank.bloodBankId}
              className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-soft hover:shadow-soft-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="font-extrabold text-xs text-stone-900 leading-snug">
                      {bank.name}
                    </h2>
                    {bank.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {bank.facilityType}
                  </div>
                </div>

                {bank.distanceKm !== undefined && (
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-crimson-600 block">
                      {bank.distanceKm} km
                    </span>
                    <span className="text-[10px] text-stone-400">away</span>
                  </div>
                )}
              </div>

              <div className="text-[11.5px] text-stone-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{bank.address}, {bank.city}</span>
              </div>

              {/* Group Availability Pill if filtered */}
              {selectedGroup !== 'ALL' && (
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">{selectedGroup} Units:</span>
                  {invItem ? (
                    <span className={`font-black ${
                      invItem.units > 3 ? 'text-emerald-700' : invItem.units > 0 ? 'text-amber-700' : 'text-rose-700'
                    }`}>
                      {invItem.units} Units Available ({invItem.status})
                    </span>
                  ) : (
                    <span className="text-stone-400 font-medium">Availability Unknown</span>
                  )}
                </div>
              )}

              {/* Verified Contact & Call/Directions Actions */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="text-[10.5px] text-stone-500 truncate">
                  Contact: <span className="text-stone-700 font-medium">{bank.contactNumber}</span>
                </div>

                <div className="flex gap-2">
                  {/* Call Button */}
                  <a
                    href={`tel:${bank.contactNumber}`}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-crimson-600" />
                    <span>Call</span>
                  </a>

                  {/* Directions Button with real navigation URL */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${bank.latitude},${bank.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 px-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
