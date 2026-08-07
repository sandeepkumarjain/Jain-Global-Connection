import React from 'react';

interface SkeletonProps {
  count?: number;
}

/**
 * MatrimonialSkeleton Component
 * Renders an elegant skeleton screen placeholder while loading candidate profiles from the database.
 */
export const MatrimonialSkeleton: React.FC<SkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="space-y-6 animate-fade-in" id="matrimonial-skeleton-container">
      {/* Top Banner Skeleton Placeholder */}
      <div className="bg-gradient-to-r from-amber-100/60 via-amber-50 to-orange-100/40 dark:from-amber-950/60 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-200/80 dark:border-amber-800/40 shadow-md space-y-3 relative overflow-hidden">
        <div className="w-48 h-6 bg-amber-200/80 dark:bg-amber-900/50 animate-pulse rounded-full" />
        <div className="w-3/4 max-w-xl h-8 bg-amber-200/90 dark:bg-amber-900/70 animate-pulse rounded-xl" />
        <div className="w-2/3 max-w-lg h-4 bg-amber-200/60 dark:bg-amber-900/40 animate-pulse rounded-lg" />
        <div className="flex gap-3 pt-2">
          <div className="w-36 h-11 bg-amber-300/80 dark:bg-amber-800/60 animate-pulse rounded-xl" />
          <div className="w-32 h-11 bg-amber-200/60 dark:bg-amber-900/40 animate-pulse rounded-xl" />
        </div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-36 h-10 bg-amber-200/70 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-32 h-10 bg-amber-100/80 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
          <div className="w-44 h-5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
        </div>
      </div>

      {/* Candidate Profile Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top decorative shimmer accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 dark:from-amber-700 dark:via-amber-500 dark:to-amber-700 animate-pulse" />

            <div className="space-y-4 pt-1">
              {/* Candidate Top Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Photo Shimmer Frame */}
                  <div className="w-20 h-24 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-200/60 to-amber-100 dark:from-slate-800 dark:via-amber-950/40 dark:to-slate-800 animate-pulse shrink-0 border-2 border-amber-300/80 dark:border-amber-700/60 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 dark:via-white/10 to-transparent animate-pulse" />
                  </div>
                  
                  {/* Text Details Shimmer */}
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                      <div className="h-5 w-12 bg-amber-200/80 dark:bg-amber-900/60 animate-pulse rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      <div className="h-4 w-24 bg-amber-100 dark:bg-slate-800 animate-pulse rounded" />
                    </div>
                    <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                    <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  </div>
                </div>

                {/* Heart Shortlist Pill */}
                <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-slate-800 animate-pulse shrink-0" />
              </div>

              {/* 4-Gotra Badges Grid Shimmer */}
              <div className="p-3 bg-amber-50/50 dark:bg-slate-800/40 rounded-xl border border-amber-200/50 dark:border-slate-800 space-y-2">
                <div className="h-3 w-32 bg-amber-200/70 dark:bg-amber-900/50 animate-pulse rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="h-6 bg-white dark:bg-slate-800 animate-pulse rounded-lg border border-amber-200/40" />
                  <div className="h-6 bg-white dark:bg-slate-800 animate-pulse rounded-lg border border-amber-200/40" />
                  <div className="h-6 bg-white dark:bg-slate-800 animate-pulse rounded-lg border border-amber-200/40" />
                  <div className="h-6 bg-white dark:bg-slate-800 animate-pulse rounded-lg border border-amber-200/40" />
                </div>
              </div>

              {/* Qualification & Occupation Details Lines */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <div className="h-10 bg-amber-500/80 dark:bg-amber-700/80 animate-pulse rounded-xl" />
              <div className="h-10 bg-emerald-500/80 dark:bg-emerald-700/80 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BusinessSkeleton Component
 * Renders a custom skeleton screen for business listings during database loading.
 */
export const BusinessSkeleton: React.FC<SkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="space-y-6 animate-fade-in" id="business-skeleton-container">
      {/* Top Main Banner Skeleton */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl border border-amber-800/40 shadow-xl space-y-3 relative overflow-hidden">
        <div className="w-48 h-6 bg-amber-500/30 animate-pulse rounded-full" />
        <div className="w-3/4 max-w-xl h-8 bg-amber-200/30 animate-pulse rounded-xl" />
        <div className="w-2/3 max-w-lg h-4 bg-slate-400/30 animate-pulse rounded-lg" />
        <div className="flex gap-3 pt-2">
          <div className="w-40 h-11 bg-amber-500/60 animate-pulse rounded-xl" />
          <div className="w-44 h-11 bg-white/20 animate-pulse rounded-xl" />
        </div>
      </div>

      {/* Search & Category Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="w-28 h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
            <div className="w-36 h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-28 h-9 bg-amber-100/70 dark:bg-slate-800 animate-pulse rounded-full shrink-0" />
          ))}
        </div>
      </div>

      {/* Business Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-3">
              {/* Business Logo & Name Header */}
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-slate-800 animate-pulse shrink-0 border border-amber-300 dark:border-amber-800 shadow-sm" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4.5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                    <div className="h-4 w-12 bg-emerald-200/80 dark:bg-emerald-950 animate-pulse rounded-full" />
                  </div>
                  <div className="h-3.5 w-1/2 bg-amber-100 dark:bg-slate-800 animate-pulse rounded" />
                  <div className="flex items-center gap-1">
                    <div className="h-3.5 w-16 bg-amber-300/80 dark:bg-amber-700/80 animate-pulse rounded" />
                    <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  </div>
                </div>
              </div>

              {/* Description & Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              </div>

              {/* Products/Services Tags */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="h-6 w-20 bg-amber-50 dark:bg-slate-800 animate-pulse rounded-md" />
                <div className="h-6 w-24 bg-amber-50 dark:bg-slate-800 animate-pulse rounded-md" />
                <div className="h-6 w-16 bg-amber-50 dark:bg-slate-800 animate-pulse rounded-md" />
              </div>

              {/* Location & Verified Badge */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="h-6 w-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                <div className="h-6 w-20 bg-emerald-100 dark:bg-emerald-950 animate-pulse rounded-lg" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <div className="h-9 bg-emerald-600/80 animate-pulse rounded-xl" />
              <div className="h-9 bg-amber-500/80 animate-pulse rounded-xl" />
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
export const TempleSkeleton: React.FC<SkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="space-y-6 animate-fade-in" id="temple-skeleton-container">
      {/* Top Banner Skeleton */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="w-48 h-6 bg-amber-400/30 animate-pulse rounded-full" />
        <div className="w-3/4 max-w-xl h-8 bg-amber-200/40 animate-pulse rounded-xl" />
        <div className="w-2/3 max-w-lg h-4 bg-amber-100/30 animate-pulse rounded-lg" />
      </div>

      {/* AI Search & Filter Bar Skeleton */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-1/2 h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          <div className="flex items-center gap-2">
            <div className="w-28 h-11 bg-amber-500/80 animate-pulse rounded-xl" />
            <div className="w-36 h-11 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-32 h-8 bg-amber-100/70 dark:bg-slate-800 animate-pulse rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Temple Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Header Image Banner Skeleton */}
              <div className="h-40 w-full bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 dark:from-slate-800 dark:via-amber-950/40 dark:to-slate-800 animate-pulse relative">
                <div className="absolute top-3 left-3 h-6 w-24 bg-amber-300/80 dark:bg-amber-900/80 animate-pulse rounded-full" />
                <div className="absolute top-3 right-3 h-6 w-20 bg-emerald-200 dark:bg-emerald-950 animate-pulse rounded-full" />
              </div>

              <div className="p-5 space-y-3">
                {/* Temple Name & Sect */}
                <div className="space-y-2">
                  <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-3.5 w-1/2 bg-amber-100 dark:bg-slate-800 animate-pulse rounded" />
                </div>

                {/* Timings & Address */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                  <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                </div>

                {/* Facilities Tags */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-6 w-20 bg-amber-100/80 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-6 w-24 bg-amber-100/80 dark:bg-slate-800 animate-pulse rounded-lg" />
                  <div className="h-6 w-16 bg-amber-100/80 dark:bg-slate-800 animate-pulse rounded-lg" />
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              <div className="h-10 bg-amber-500/80 animate-pulse rounded-xl" />
              <div className="h-10 bg-rose-600/80 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl col-span-2 sm:col-span-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

