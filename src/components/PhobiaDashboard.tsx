import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PHOBIA_TYPES, type PhobiaType } from '../types';

interface PhobiaStats {
  phobiaType: PhobiaType;
  totalAssessments: number;
  avgIntensity: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  severeRisk: number;
}

interface RegionalPhobiaData {
  region: string;
  intensity: number;
  count: number;
}

interface PhobiaDashboardProps {
  onBack: () => void;
}

export default function PhobiaDashboard({ onBack }: PhobiaDashboardProps) {
  const [phobiaStats, setPhobiaStats] = useState<PhobiaStats[]>([]);
  const [selectedPhobia, setSelectedPhobia] = useState<PhobiaType | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalPhobiaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  useEffect(() => {
    fetchPhobiaData();
  }, [timeRange]);

  const fetchPhobiaData = async () => {
    try {
      const stats: PhobiaStats[] = [];

      for (const phobiaType of PHOBIA_TYPES) {
        let query = supabase.from(phobiaType.table).select('*');

        if (timeRange === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          query = query.gte('submitted_at', weekAgo.toISOString());
        } else if (timeRange === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          query = query.gte('submitted_at', monthAgo.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error(`Error fetching ${phobiaType.table}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          const totalIntensity = data.reduce((sum, item) => sum + item.intensity_percentage, 0);
          const avgIntensity = totalIntensity / data.length;

          const riskCounts = data.reduce((acc, item) => {
            acc[item.risk_level.toLowerCase()] = (acc[item.risk_level.toLowerCase()] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          stats.push({
            phobiaType,
            totalAssessments: data.length,
            avgIntensity: Math.round(avgIntensity),
            lowRisk: riskCounts['low'] || 0,
            mediumRisk: riskCounts['medium'] || 0,
            highRisk: riskCounts['high'] || 0,
            severeRisk: riskCounts['severe'] || 0
          });
        }
      }

      stats.sort((a, b) => b.totalAssessments - a.totalAssessments);
      setPhobiaStats(stats);

      if (stats.length > 0 && !selectedPhobia) {
        setSelectedPhobia(stats[0].phobiaType);
        await fetchRegionalData(stats[0].phobiaType);
      } else if (selectedPhobia) {
        await fetchRegionalData(selectedPhobia);
      }
    } catch (error) {
      console.error('Error fetching phobia data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegionalData = async (phobiaType: PhobiaType) => {
    try {
      let query = supabase.from(phobiaType.table).select('*');

      if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('submitted_at', weekAgo.toISOString());
      } else if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('submitted_at', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        const regionMap = data.reduce((acc, item) => {
          if (!acc[item.region]) {
            acc[item.region] = { totalIntensity: 0, count: 0 };
          }
          acc[item.region].totalIntensity += item.intensity_percentage;
          acc[item.region].count += 1;
          return acc;
        }, {} as Record<string, { totalIntensity: number; count: number }>);

        const regional = Object.entries(regionMap).map(([region, data]) => ({
          region,
          intensity: Math.round(data.totalIntensity / data.count),
          count: data.count
        })).sort((a, b) => b.intensity - a.intensity);

        setRegionalData(regional);
      }
    } catch (error) {
      console.error('Error fetching regional data:', error);
    }
  };

  const handlePhobiaSelect = (phobiaType: PhobiaType) => {
    setSelectedPhobia(phobiaType);
    fetchRegionalData(phobiaType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-orange-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading phobia intelligence data...</p>
        </div>
      </div>
    );
  }

  const selectedStats = phobiaStats.find(s => s.phobiaType.id === selectedPhobia?.id);
  const totalRisks = selectedStats ? selectedStats.lowRisk + selectedStats.mediumRisk + selectedStats.highRisk + selectedStats.severeRisk : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Phobia Intelligence Dashboard</h1>
              <p className="text-gray-600">Phobia prevalence patterns and intensity analysis</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'week' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'month' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Phobia Prevalence Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {phobiaStats.length > 0 ? (
              phobiaStats.map((stat) => (
                <button
                  key={stat.phobiaType.id}
                  onClick={() => handlePhobiaSelect(stat.phobiaType)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPhobia?.id === stat.phobiaType.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-900">{stat.totalAssessments}</div>
                  <p className="text-sm text-gray-600 font-semibold">{stat.phobiaType.name}</p>
                  <div className={`mt-2 text-xs font-semibold ${
                    stat.avgIntensity >= 75 ? 'text-red-600' :
                    stat.avgIntensity >= 50 ? 'text-orange-600' :
                    stat.avgIntensity >= 25 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {stat.avgIntensity}% avg intensity
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-5 text-center py-8 text-gray-500">
                No phobia assessment data available yet
              </div>
            )}
          </div>
        </div>

        {selectedStats && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{selectedStats.totalAssessments}</div>
                <p className="text-gray-600">Total Assessments</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <TrendingUp className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-3xl font-bold text-orange-600">{selectedStats.avgIntensity}%</div>
                <p className="text-gray-600">Avg Intensity</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-8 h-8 rounded-full bg-red-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{selectedStats.severeRisk}</div>
                <p className="text-gray-600">Severe Risk</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="w-8 h-8 rounded-full bg-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">{selectedStats.highRisk}</div>
                <p className="text-gray-600">High Risk</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Risk Level Distribution
                  <span className="block text-sm font-normal text-gray-600 mt-1">
                    {selectedPhobia?.medicalTerm}
                  </span>
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Low Risk</span>
                      <span className="text-gray-600">{selectedStats.lowRisk} ({totalRisks > 0 ? Math.round((selectedStats.lowRisk / totalRisks) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${totalRisks > 0 ? (selectedStats.lowRisk / totalRisks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Medium Risk</span>
                      <span className="text-gray-600">{selectedStats.mediumRisk} ({totalRisks > 0 ? Math.round((selectedStats.mediumRisk / totalRisks) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all"
                        style={{ width: `${totalRisks > 0 ? (selectedStats.mediumRisk / totalRisks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">High Risk</span>
                      <span className="text-gray-600">{selectedStats.highRisk} ({totalRisks > 0 ? Math.round((selectedStats.highRisk / totalRisks) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-orange-500 h-3 rounded-full transition-all"
                        style={{ width: `${totalRisks > 0 ? (selectedStats.highRisk / totalRisks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-semibold">Severe Risk</span>
                      <span className="text-gray-600">{selectedStats.severeRisk} ({totalRisks > 0 ? Math.round((selectedStats.severeRisk / totalRisks) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all"
                        style={{ width: `${totalRisks > 0 ? (selectedStats.severeRisk / totalRisks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Intensity Heatmap</h2>
                <div className="space-y-3">
                  {regionalData.length > 0 ? (
                    regionalData.slice(0, 8).map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{region.region || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{region.count} assessments</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            region.intensity >= 75 ? 'bg-red-500' :
                            region.intensity >= 50 ? 'bg-orange-500' :
                            region.intensity >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className={`text-2xl font-bold ${
                            region.intensity >= 75 ? 'text-red-600' :
                            region.intensity >= 50 ? 'text-orange-600' :
                            region.intensity >= 25 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {region.intensity}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No regional data available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <p className="text-yellow-800">
            <strong>Educational Disclaimer:</strong> This dashboard provides community-level phobia
            prevalence patterns for educational and research purposes only. Data is anonymized and
            aggregated. This is not a diagnostic tool.
          </p>
        </div>
      </div>
    </div>
  );
}
