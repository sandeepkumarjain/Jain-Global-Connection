import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, Sparkles, CheckCircle2, Quote, Plus, X, Upload, MapPin, Calendar, Building, MessageSquare } from 'lucide-react';
import { MatrimonialSuccessStory } from '../types';

export interface VivahSuccessStoriesSectionProps {
  showDeactivateButton?: boolean;
}

export const VivahSuccessStoriesSection: React.FC<VivahSuccessStoriesSectionProps> = ({
  showDeactivateButton = false
}) => {
  const { successStories, submitSuccessStory, matrimonials, currentUser, showToast } = useApp();

  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<string | null>(null);

  // Form State
  const [selectedMatrimonialId, setSelectedMatrimonialId] = useState<string>('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [marriageDate, setMarriageDate] = useState(new Date().toISOString().split('T')[0]);
  const [matchSource, setMatchSource] = useState<'JainConnect Global' | 'Other Portal / Offline Match'>('JainConnect Global');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [couplePhotoUrl, setCouplePhotoUrl] = useState('');
  const [city, setCity] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter user's or active matrimonial profiles for selection
  const myMatrimonialProfiles = matrimonials.filter(
    (m) =>
      m.maritalStatus !== 'Married' &&
      (currentUser?.role === 'Super Admin' ||
        currentUser?.role === 'Admin' ||
        m.userId === currentUser?.id ||
        (m.contactEmail && m.contactEmail?.toLowerCase() === currentUser?.email?.toLowerCase()) ||
        (m.contactMobile && m.contactMobile === currentUser?.mobile))
  );

  const handleSelectProfileToDeactivate = (profileId: string) => {
    setSelectedMatrimonialId(profileId);
    const found = matrimonials.find((m) => m.id === profileId);
    if (found) {
      if (found.gender === 'Bride') {
        setBrideName(found.fullName);
      } else {
        setGroomName(found.fullName);
      }
      setCity(found.city || '');
      if (found.photoUrl) setCouplePhotoUrl(found.photoUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !groomName.trim()) {
      showToast('Incomplete Form', 'Please provide both Bride and Groom names.', 'error');
      return;
    }

    if (matchSource === 'JainConnect Global' && !feedback.trim()) {
      showToast('Feedback Required', 'Kindly share your experience with JainConnect Global.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSuccessStory(
        {
          profileId: selectedMatrimonialId || undefined,
          brideName: brideName.trim(),
          groomName: groomName.trim(),
          marriageDate,
          matchSource,
          feedback: feedback.trim(),
          rating,
          couplePhotoUrl: couplePhotoUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
          city: city.trim() || 'India',
          submittedBy: currentUser?.fullName || groomName || brideName,
          isApproved: true,
        },
        selectedMatrimonialId || undefined
      );

      // Reset Form & Close
      setShowStoryModal(false);
      setBrideName('');
      setGroomName('');
      setFeedback('');
      setCouplePhotoUrl('');
      setSelectedMatrimonialId('');
    } catch (err) {
      console.error('Error submitting success story:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 my-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-400/40 rounded-full text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>💐 Vivah Bandhan • Verified Jain Success Stories</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              Celebrating Blessed Jain Unions Worldwide
            </h2>

            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Read inspiring journeys of Jain brides, grooms, and respected families who found their lifelong soulmates through our verified platform.
            </p>
          </div>

          {showDeactivateButton && (
            <button
              onClick={() => setShowStoryModal(true)}
              className="px-5 py-3.5 min-h-[44px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 border border-amber-300/60"
            >
              <Heart className="w-4 h-4 text-rose-700 fill-rose-700 animate-pulse" />
              <span>Got Married? Deactivate Profile & Share Story</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successStories.map((story) => (
          <div
            key={story.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/50 p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative group"
          >
            {/* Top Match Source Badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${
                  story.matchSource === 'JainConnect Global'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border border-amber-300/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>{story.matchSource}</span>
              </span>

              {/* Star Rating */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: story.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Couple Image & Names */}
            <div className="space-y-3">
              <div
                onClick={() => setSelectedPhotoForView(story.couplePhotoUrl || '')}
                className="relative overflow-hidden rounded-2xl cursor-pointer group/img aspect-[4/3] bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={story.couplePhotoUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'}
                  alt={`${story.brideName} & ${story.groomName}`}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-bold flex items-center gap-1">
                    🔍 Click to View Full Image
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-serif font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{story.groomName}</span>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block shrink-0" />
                  <span>{story.brideName}</span>
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Wedding Date: {story.marriageDate}</span>
                  </span>
                  {story.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{story.city}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Quote */}
              {story.feedback && (
                <div className="bg-rose-50/60 dark:bg-rose-950/30 p-3.5 rounded-2xl border border-rose-100 dark:border-rose-900/40 relative">
                  <Quote className="w-4 h-4 text-rose-400 dark:text-rose-600 absolute top-2 right-2 opacity-50" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed pr-4">
                    &quot;{story.feedback}&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Matrimonial Alliance</span>
              <span>By {story.submittedBy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Photo View Lightbox */}
      {selectedPhotoForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedPhotoForView(null)}
              className="absolute -top-12 right-0 text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedPhotoForView}
              alt="Vivah Success Couple"
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border-2 border-amber-400/40"
            />
          </div>
        </div>
      )}

      {/* Deactivate & Share Vivah Feedback Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-slate-800 dark:text-slate-100 my-8 space-y-5">
            
            <button
              onClick={() => setShowStoryModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center border-b border-rose-100 dark:border-rose-900/50 pb-4">
              <div className="inline-flex p-3 bg-rose-100 dark:bg-rose-950/60 rounded-2xl text-rose-600 dark:text-rose-400 mb-1">
                <Heart className="w-8 h-8 fill-rose-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold font-serif text-slate-900 dark:text-white">
                Deactivate Married Profile & Submit Feedback
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inform the community that you or your family candidate got married. Your feedback will be displayed on the homepage and saved to Supabase!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Select Profile to Deactivate (if available) */}
              {myMatrimonialProfiles.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Candidate Profile to Deactivate & Remove:
                  </label>
                  <select
                    value={selectedMatrimonialId}
                    onChange={(e) => handleSelectProfileToDeactivate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-rose-200 dark:border-rose-800 font-medium"
                  >
                    <option value="">-- Select Profile (Or enter manually below) --</option>
                    {myMatrimonialProfiles.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.gender} • {m.city}) - ID: {m.applicationId || m.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Match Source */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Where did you find your right match? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMatchSource('JainConnect Global')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      matchSource === 'JainConnect Global'
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${matchSource === 'JainConnect Global' ? 'text-rose-600 fill-rose-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-extrabold text-xs">Through JainConnect Global</div>
                      <div className="text-[10px] opacity-80">Matched directly on our portal</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatchSource('Other Portal / Offline Match')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      matchSource === 'Other Portal / Offline Match'
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 text-slate-900 dark:text-white font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${matchSource === 'Other Portal / Offline Match' ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-extrabold text-xs">Other Portal / Offline</div>
                      <div className="text-[10px] opacity-80">Family reference or other site</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bride & Groom Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Groom Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Siddharth Jain"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bride Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Riya Shah"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Wedding / Marriage Date</label>
                  <input
                    type="date"
                    value={marriageDate}
                    onChange={(e) => setMarriageDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                  />
                </div>
              </div>

              {/* Couple Wedding Photo URL */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Wedding / Couple Photo Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or image URL"
                  value={couplePhotoUrl}
                  onChange={(e) => setCouplePhotoUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                />
              </div>

              {/* If matched via JainConnect Global: Feedback & Star Rating */}
              {matchSource === 'JainConnect Global' && (
                <div className="space-y-3 p-3.5 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60">
                  <div>
                    <label className="block font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Your Feedback & Testimonial *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us how JainConnect Global helped you find your soulmate and bring two respected Jain families together..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required={matchSource === 'JainConnect Global'}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-amber-900 dark:text-amber-200 mb-1">
                      Rating for JainConnect Global
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmDeactivate}
                  onChange={(e) => setConfirmDeactivate(e.target.checked)}
                  required
                  className="w-4 h-4 mt-0.5 text-rose-600 rounded border-rose-300 focus:ring-rose-500"
                />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                  I confirm that the candidate profile has got married successfully. Kindly deactivate and remove this candidate profile from active matrimonial searches.
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{isSubmitting ? 'Saving & Syncing...' : 'Submit Feedback & Deactivate Profile'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
