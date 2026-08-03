import React from 'react';

/**
 * MatrimonialSkeleton Component
 * Renders an elegant skeleton screen placeholder while loading candidate profiles.
 */
export const MatrimonialSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="matrimonial-skeleton-container">
      {/* Search & Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-24 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-32 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-28 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-24 h-8 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Candidate Profile Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Candidate Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Photo Shimmer Frame */}
                  <div className="w-20 h-24 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0 border-2 border-slate-300/60 dark:border-slate-700/60 shadow-sm" />
                  
                  {/* Text Details Shimmer */}
                  <div className="flex-1 space-y-2.5">
                    <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                    </div>
                    <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                    <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  </div>
                </div>

                {/* Heart Shortlist Pill */}
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
                <div className="h-7 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              </div>

              {/* Bio Details Lines */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl col-span-2 sm:col-span-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BusinessSkeleton Component
 * Renders a skeleton screen for business listings during database loading.
 */
export const BusinessSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="business-skeleton-container">
      {/* Search & Category Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="w-28 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-36 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-28 h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Business Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Business Logo & Name Header */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0 border border-slate-300 dark:border-slate-700 shadow-sm" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </div>
              </div>

              {/* Description & Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </div>

              {/* Location & Verified Badge */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <div className="h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * TempleSkeleton Component
 * Renders a skeleton screen for Holy Temple & Tirth directory listings.
 */
export const TempleSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in" id="temple-skeleton-container">
      {/* Search & Sect Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="w-28 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-36 h-11 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>

      {/* Temple Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Header Image Banner Skeleton */}
              <div className="h-36 w-full bg-slate-200 dark:bg-slate-800 animate-pulse relative">
                <div className="absolute top-3 left-3 h-6 w-24 bg-slate-300 dark:bg-slate-700 animate-pulse rounded-full" />
                <div className="absolute top-3 right-3 h-6 w-16 bg-slate-300 dark:bg-slate-700 animate-pulse rounded-full" />
              </div>

              <div className="p-5 space-y-3">
                {/* Temple Name & Sect */}
                <div className="space-y-2">
                  <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </div>

                {/* Timings & Address */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </div>

                {/* Facilities Tags */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-2">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
