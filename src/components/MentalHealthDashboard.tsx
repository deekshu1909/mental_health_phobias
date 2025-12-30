import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalResponses: number;
  avgWellnessScore: number;
  stableCount: number;
  mildCount: number;
  moderateCount: number;
  severeCount: number;
  recentTrend: 'up' | 'down' | 'stable';
}

interface RegionalData {
  region: string;
  avgScore: number;
  count: number;
}

interface MentalHealthDashboardProps {
  onBack: () => void;
}

export default function MentalHealthDashboard({ onBack }: MentalHealthDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalResponses: 0,
    avgWellnessScore: 0,
    stableCount: 0,
    mildCount: 0,
    moderateCount: 0,
    severeCount: 0,
    recentTrend: 'stable'
  });
  const [regionalData, setRegionalData] = useState<RegionalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      let query = supabase
        .from('mental_health_responses')
        .select('*');

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
        const totalScore = data.reduce((sum, item) => sum + item.wellness_score, 0);
        const avgScore = totalScore / data.length;

        const severityCounts = data.reduce((acc, item) => {
          acc[item.severity_category.toLowerCase()] = (acc[item.severity_category.toLowerCase()] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const regionMap = data.reduce((acc, item) => {
          if (!acc[item.region]) {
            acc[item.region] = { totalScore: 0, count: 0 };
          }
          acc[item.region].totalScore += item.wellness_score;
          acc[item.region].count += 1;
          return acc;
        }, {} as Record<string, { totalScore: number; count: number }>);

        const regionalStats = Object.entries(regionMap).map(([region, data]) => ({
          region,
          avgScore: data.totalScore / data.count,
          count: data.count
        })).sort((a, b) => b.avgScore - a.avgScore);

        setStats({
          totalResponses: data.length,
          avgWellnessScore: Math.round(avgScore),
          stableCount: severityCounts['stable'] || 0,
          mildCount: severityCounts['mild'] || 0,
          moderateCount: severityCounts['moderate'] || 0,
          severeCount: severityCounts['severe'] || 0,
          recentTrend: avgScore > 60 ? 'up' : avgScore < 40 ? 'down' : 'stable'
        });

        setRegionalData(regionalStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const totalCategorized = stats.stableCount + stats.mildCount + stats.moderateCount + stats.severeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mental Health Analytics</h1>
              <p className="text-gray-600">Community psychological wellness trends</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timeRange === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              {stats.recentTrend === 'up' && <TrendingUp className="w-6 h-6 text-green-500" />}
              {stats.recentTrend === 'down' && <TrendingDown className="w-6 h-6 text-red-500" />}
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalResponses}</div>
            <p className="text-gray-600">Total Responses</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{stats.avgWellnessScore}</div>
            <p className="text-gray-600">Avg Wellness Score</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.stableCount}</div>
            <p className="text-gray-600">Stable Status</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.severeCount}</div>
            <p className="text-gray-600">Severe Status</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Severity Distribution</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Stable</span>
                  <span className="text-gray-600">{stats.stableCount} ({totalCategorized > 0 ? Math.round((stats.stableCount / totalCategorized) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${totalCategorized > 0 ? (stats.stableCount / totalCategorized) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Mild</span>
                  <span className="text-gray-600">{stats.mildCount} ({totalCategorized > 0 ? Math.round((stats.mildCount / totalCategorized) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all"
                    style={{ width: `${totalCategorized > 0 ? (stats.mildCount / totalCategorized) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Moderate</span>
                  <span className="text-gray-600">{stats.moderateCount} ({totalCategorized > 0 ? Math.round((stats.moderateCount / totalCategorized) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full transition-all"
                    style={{ width: `${totalCategorized > 0 ? (stats.moderateCount / totalCategorized) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Severe</span>
                  <span className="text-gray-600">{stats.severeCount} ({totalCategorized > 0 ? Math.round((stats.severeCount / totalCategorized) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{ width: `${totalCategorized > 0 ? (stats.severeCount / totalCategorized) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Regional Wellness Scores</h2>
            <div className="space-y-3">
              {regionalData.length > 0 ? (
                regionalData.slice(0, 8).map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{region.region || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{region.count} responses</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      region.avgScore >= 75 ? 'text-green-600' :
                      region.avgScore >= 50 ? 'text-yellow-600' :
                      region.avgScore >= 25 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {Math.round(region.avgScore)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No regional data available yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <p className="text-blue-900">
            <strong>Note:</strong> All data is anonymized and aggregated to protect individual privacy.
            This dashboard provides community-level insights only.
          </p>
        </div>
      </div>
    </div>
  );
}
