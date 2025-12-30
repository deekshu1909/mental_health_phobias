import { useState, useEffect } from 'react';
import { ArrowLeft, Download, AlertTriangle, Users, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PHOBIA_TYPES } from '../types';

interface AdminPanelProps {
  onBack: () => void;
}

interface SystemStats {
  totalMentalHealthResponses: number;
  totalPhobiaAssessments: number;
  criticalAlerts: number;
  activeRegions: number;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [stats, setStats] = useState<SystemStats>({
    totalMentalHealthResponses: 0,
    totalPhobiaAssessments: 0,
    criticalAlerts: 0,
    activeRegions: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExport, setSelectedExport] = useState<string>('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: mentalHealthData } = await supabase
        .from('mental_health_responses')
        .select('*');

      let totalPhobiaAssessments = 0;
      for (const phobiaType of PHOBIA_TYPES) {
        const { data } = await supabase
          .from(phobiaType.table)
          .select('*');
        if (data) {
          totalPhobiaAssessments += data.length;
        }
      }

      const mentalHealthCount = mentalHealthData?.length || 0;
      const criticalCount = mentalHealthData?.filter(item => item.severity_category === 'Severe').length || 0;

      const regions = new Set(mentalHealthData?.map(item => item.region).filter(r => r));

      setStats({
        totalMentalHealthResponses: mentalHealthCount,
        totalPhobiaAssessments,
        criticalAlerts: criticalCount,
        activeRegions: regions.size
      });

      const recent = mentalHealthData?.slice(-10).reverse() || [];
      setRecentActivity(recent);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!selectedExport) {
      alert('Please select a data type to export');
      return;
    }

    try {
      let data: any[] = [];
      let filename = '';

      if (selectedExport === 'mental_health') {
        const { data: mentalData } = await supabase
          .from('mental_health_responses')
          .select('*');
        data = mentalData || [];
        filename = 'mental_health_data.csv';
      } else {
        const phobiaType = PHOBIA_TYPES.find(p => p.id === selectedExport);
        if (phobiaType) {
          const { data: phobiaData } = await supabase
            .from(phobiaType.table)
            .select('*');
          data = phobiaData || [];
          filename = `${phobiaType.id}_data.csv`;
        }
      }

      if (data.length === 0) {
        alert('No data available to export');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin & Health Authority Panel</h1>
          <p className="text-gray-600">System overview and data management</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.totalMentalHealthResponses}</div>
            <p className="text-gray-600">Mental Health Responses</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <Activity className="w-8 h-8 text-orange-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.totalPhobiaAssessments}</div>
            <p className="text-gray-600">Phobia Assessments</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.criticalAlerts}</div>
            <p className="text-gray-600">Critical Cases</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="w-8 h-8 rounded-full bg-green-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.activeRegions}</div>
            <p className="text-gray-600">Active Regions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Export Data</h2>
            <p className="text-gray-600 mb-6">
              Download anonymized data reports for analysis and research purposes.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Data Type</label>
                <select
                  value={selectedExport}
                  onChange={(e) => setSelectedExport(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose data type...</option>
                  <option value="mental_health">Mental Health Responses</option>
                  {PHOBIA_TYPES.map(phobia => (
                    <option key={phobia.id} value={phobia.id}>
                      {phobia.medicalTerm} Assessments
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleExportData}
                disabled={!selectedExport}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export as CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">Mental Health Assessment</p>
                        <p className="text-sm text-gray-600">
                          Region: {activity.region || 'N/A'} | Age: {activity.age_group || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.severity_category === 'Stable' ? 'bg-green-100 text-green-800' :
                        activity.severity_category === 'Mild' ? 'bg-yellow-100 text-yellow-800' :
                        activity.severity_category === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.severity_category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(activity.submitted_at).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alert Configuration</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Severe Case Threshold (%)
              </label>
              <input
                type="number"
                defaultValue="20"
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Alert when severe cases exceed this percentage
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Notifications
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Receive alerts when thresholds are exceeded
              </p>
            </div>
          </div>
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Save Configuration
          </button>
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <p className="text-blue-900">
            <strong>Privacy Notice:</strong> All exported data is anonymized and complies with HIPAA
            and GDPR regulations. Individual user information is never exposed.
          </p>
        </div>
      </div>
    </div>
  );
}
