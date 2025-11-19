import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Hardcoded data for instant display
const FEATURED_SPECIALTIES = [
  { name: 'Gynecologist', slug: 'gynecologist', count: 999 },
  { name: 'Dentist', slug: 'dentist', count: 545 },
  { name: 'Dermatologist', slug: 'dermatologist', count: 443 },
  { name: 'Psychiatrist', slug: 'psychiatrist', count: 338 },
  { name: 'Urologist', slug: 'urologist', count: 274 },
  { name: 'ENT Specialist', slug: 'ent-specialist', count: 124 },
];

const FEATURED_SYMPTOMS = [
  { name: 'Anemia', slug: 'anemia' },
  { name: 'Arthritis', slug: 'arthritis' },
  { name: 'Fatigue', slug: 'fatigue' },
  { name: 'Cold and Influenza', slug: 'cold-and-influenza' },
  { name: 'Nausea', slug: 'nausea' },
  { name: 'Metabolic Syndrome', slug: 'metabolic-syndrome' },
];

const MegaDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 top-full mt-0 w-[800px] bg-white rounded-lg shadow-2xl border border-neutral-200 transition-all duration-200"
      style={{ zIndex: 100 }}
    >
      <div className="p-6">
        {/* Row 1: Specialties and Symptoms */}
        <div className="grid grid-cols-2 gap-6 pb-6 mb-6 border-b border-neutral-200">
          {/* Specialties */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Specialties
            </h3>
            <div className="space-y-1">
              {FEATURED_SPECIALTIES.map((specialty) => (
                <Link
                  key={specialty.slug}
                  to={`/doctors?specialty=${specialty.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>{specialty.name}</span>
                    <span className="text-xs text-neutral-500">{specialty.count}</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/specialties"
                onClick={onClose}
                className="block px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-md transition-colors"
              >
                View All Specialties →
              </Link>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Symptoms
            </h3>
            <div className="space-y-1">
              {FEATURED_SYMPTOMS.map((symptom) => (
                <Link
                  key={symptom.slug}
                  to={`/doctors?symptom=${symptom.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors truncate"
                >
                  {symptom.name}
                </Link>
              ))}
              <Link
                to="/symptoms"
                onClick={onClose}
                className="block px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-md transition-colors"
              >
                View All Symptoms →
              </Link>
            </div>
          </div>
        </div>

          {/* Row 2: Cities and Hospitals */}
          <div className="grid grid-cols-2 gap-6">
            {/* Cities */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cities
              </h3>
              <div className="space-y-1">
                <Link
                  to="/doctors?city=Karachi"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                >
                  Karachi
                </Link>
                <Link
                  to="/doctors?city=Lahore"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                >
                  Lahore
                </Link>
                <Link
                  to="/doctors?city=Islamabad"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors"
                >
                  Islamabad
                </Link>
                <Link
                  to="/cities"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-md transition-colors"
                >
                  View All Cities →
                </Link>
              </div>
            </div>

            {/* Hospitals */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Hospitals
              </h3>
              <div className="space-y-1">
                <Link
                  to="/doctors?hospital=aga-khan-university-hospital"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors truncate"
                >
                  Aga Khan University Hospital
                </Link>
                <Link
                  to="/doctors?hospital=shifa-international-hospital"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors truncate"
                >
                  Shifa International Hospital
                </Link>
                <Link
                  to="/doctors?hospital=liaquat-national-hospital"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-neutral-700 hover:bg-primary/10 hover:text-primary rounded-md transition-colors truncate"
                >
                  Liaquat National Hospital
                </Link>
                <Link
                  to="/hospitals"
                  onClick={onClose}
                  className="block px-3 py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-md transition-colors"
                >
                  View All Hospitals →
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MegaDropdown;