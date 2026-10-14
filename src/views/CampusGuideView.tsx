import React, { useState } from 'react';
import {
  Compass,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldAlert,
  Tag,
  User,
} from 'lucide-react';
import { LeafletMap, MapMarker } from '../components/LeafletMap';
import { CAMPUS_LOCATIONS, CONTACT_DIRECTORY } from '../data/mockData';

export const CampusGuideView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const categories = ['All', 'Faculty', 'HOD', 'Senior Mentor', 'Administration', 'Emergency'];

  const campusCoords: [number, number] = [19.0463, 72.8893];

  const mapMarkers: MapMarker[] = CAMPUS_LOCATIONS.map((loc) => ({
    id: loc.id,
    coords: loc.coords,
    title: loc.name,
    subtitle: `${loc.block} • ${loc.floor}`,
    badge: loc.category,
  }));

  const filteredContacts = CONTACT_DIRECTORY.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-1">
          <Compass className="w-3.5 h-3.5" /> Campus Navigation & Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          "Who Do I Contact?" & Campus Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Find key authorities, faculty mentors, labs, library, exam cell, and canteen spots across VESIT campus.
        </p>
      </div>

      {/* Interactive Leaflet Campus Location Guide */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              VESIT Interactive Campus Map (OpenStreetMap)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click on pins or select facilities below to view floor details and timings.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 rounded-full self-start sm:self-auto font-medium">
            Collector Colony, Chembur
          </span>
        </div>

        <LeafletMap center={campusCoords} zoom={18} markers={mapMarkers} className="h-80 w-full" />

        {/* Location cards horizontal scroller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {CAMPUS_LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition shadow-2xs ${
                selectedLocationId === loc.id
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{loc.name}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-600">
                  {loc.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{loc.description}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>{loc.block} ({loc.floor})</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 font-medium">{loc.timing}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Who Do I Contact Directory</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Direct helpline numbers and faculty room details</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, tags (e.g. attendance, SOS)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContacts.map((contact) => {
            const isEmergency = contact.category === 'Emergency';

            return (
              <div
                key={contact.id}
                className={`p-5 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-gradient-to-br from-rose-50 via-white to-pink-50/50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 border-rose-200 dark:border-rose-900/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                          isEmergency
                            ? 'bg-rose-500 text-white'
                            : 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400'
                        }`}
                      >
                        {isEmergency ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</h4>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold">{contact.role}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{contact.department}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isEmergency
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {contact.category}
                    </span>
                  </div>

                  {/* Room & Availability */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{contact.cabinOrRoom}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 pl-5">
                      Available: <span className="text-slate-800 dark:text-slate-200 font-medium">{contact.availability}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        <Tag className="w-2.5 h-2.5 text-indigo-500 dark:text-indigo-400" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isEmergency
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" /> Call ({contact.phone.split(' ')[0]})
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Email
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
