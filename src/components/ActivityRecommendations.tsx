import React, { useState } from 'react';
import {
  Activity,
  Footprints,
  Bike,
  Utensils,
  Compass,
  Umbrella,
  Glasses,
  Shirt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ActivityRecommendation, GearRecommendation, ActivitySuitability } from '../types/weather';

interface ActivityRecommendationsProps {
  activities: ActivityRecommendation[];
  gear: GearRecommendation;
}

export const ActivityRecommendations: React.FC<ActivityRecommendationsProps> = ({
  activities,
  gear,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getSuitabilityBadge = (suitability: ActivitySuitability) => {
    switch (suitability) {
      case 'Optimal':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80';
      case 'Good':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/80';
      case 'Moderate':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80';
      case 'Poor':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/80';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 60) return 'text-cyan-400 stroke-cyan-500';
    if (score >= 40) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-cyan-400" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-emerald-400" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-cyan-400" />;
    }
  };

  const filteredActivities =
    selectedCategory === 'all'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-6" id="activity-recommendation-engine">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Activity Intelligence & Planning Engine
            </h3>
            <p className="text-xs text-slate-400">
              Automated atmospheric suitability assessment & environmental advisory
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start text-xs">
          {['all', 'fitness', 'commute', 'leisure', 'outdoor'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredActivities.map((act) => {
          return (
            <div
              key={act.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between hover:border-slate-700/80 transition-all"
            >
              <div>
                {/* Header with Title & Score Gauge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                      {getActivityIcon(act.icon)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{act.title}</h4>
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSuitabilityBadge(
                          act.suitability
                        )}`}
                      >
                        {act.suitability}
                      </span>
                    </div>
                  </div>

                  {/* Circular Score Rating */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={getScoreColor(act.score)}
                        strokeDasharray={`${act.score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-white">
                      {act.score}%
                    </span>
                  </div>
                </div>

                {/* Headline summary */}
                <p className="text-xs font-semibold text-slate-200 mb-2 leading-snug">
                  {act.headline}
                </p>

                {/* Reasoning description */}
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {act.reasoning}
                </p>

                {/* Prime Time Window */}
                {act.bestTimeWindow && (
                  <div className="mb-3 px-3 py-1.5 rounded-lg bg-cyan-950/50 border border-cyan-800/60 flex items-center space-x-2 text-xs text-cyan-300">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                    <span className="font-medium">{act.bestTimeWindow}</span>
                  </div>
                )}
              </div>

              {/* Actionable recommendations list */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                {act.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 leading-tight">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Attire & Gear Advisory Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-tight">
            Daily Gear, Attire & Protection Advisory
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Umbrella */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center">
                <Umbrella className="w-4 h-4 text-sky-400 mr-1.5" /> Umbrella
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gear.umbrella.needed
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {gear.umbrella.needed ? 'REQUIRED' : 'NOT NEEDED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{gear.umbrella.reason}</p>
          </div>

          {/* Sunglasses */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center">
                <Glasses className="w-4 h-4 text-amber-400 mr-1.5" /> Eyewear
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  gear.sunglasses.needed
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {gear.sunglasses.needed ? 'RECOMMENDED' : 'OPTIONAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{gear.sunglasses.reason}</p>
          </div>

          {/* Outerwear */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center">
                <Shirt className="w-4 h-4 text-teal-400 mr-1.5" /> Outerwear
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                LAYERS
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-200 mb-1">{gear.outerwear.layer}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{gear.outerwear.reason}</p>
          </div>

          {/* Footwear */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center">
                <Footprints className="w-4 h-4 text-indigo-400 mr-1.5" /> Footwear
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                TRACTION
              </span>
            </div>
            <div className="font-semibold text-xs text-slate-200 mb-1">{gear.footwear.advice}</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{gear.footwear.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
