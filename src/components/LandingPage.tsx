import { Brain, Heart, Shield, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">HealthWatch AI</h1>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Community Health Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Crowdsourced, anonymous health and psychological data collection platform for
            real-time community wellness monitoring and mental health surveillance.
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Privacy-first design • AI-driven insights • Empowering communities
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Protected</h3>
            <p className="text-gray-600">
              All submissions are anonymous and encrypted. Your data contributes to community
              insights without revealing your identity.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
            <Brain className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Driven Analysis</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms analyze patterns to provide actionable
              wellness insights and early warning signals.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
            <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Trends</h3>
            <p className="text-gray-600">
              Monitor community-level mental health and phobia patterns with live dashboards
              and interactive visualizations.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Take an Assessment
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('mental-health')}
              className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Heart className="w-10 h-10 mb-4 mx-auto" />
              <h4 className="text-2xl font-bold mb-2">Mental Health Check</h4>
              <p className="text-purple-100">
                Comprehensive 12-question psychological wellness assessment
              </p>
            </button>
            <button
              onClick={() => onNavigate('phobia')}
              className="group bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              <Shield className="w-10 h-10 mb-4 mx-auto" />
              <h4 className="text-2xl font-bold mb-2">Phobia Assessment</h4>
              <p className="text-orange-100">
                Evaluate specific phobia intensity and impact on daily life
              </p>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-12 text-white">
          <h3 className="text-3xl font-bold text-center mb-12">
            View Community Analytics
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('mental-health-dashboard')}
              className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg hover:bg-opacity-30 transition-all"
            >
              <Brain className="w-10 h-10 mb-4 mx-auto" />
              <h4 className="text-2xl font-bold mb-2">Mental Health Dashboard</h4>
              <p className="text-blue-100">
                Community psychological wellness trends and regional analysis
              </p>
            </button>
            <button
              onClick={() => onNavigate('phobia-dashboard')}
              className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg hover:bg-opacity-30 transition-all"
            >
              <TrendingUp className="w-10 h-10 mb-4 mx-auto" />
              <h4 className="text-2xl font-bold mb-2">Phobia Intelligence Dashboard</h4>
              <p className="text-green-100">
                Phobia prevalence patterns and intensity heatmaps
              </p>
            </button>
          </div>
        </div>

        <div className="mt-16 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <p className="text-yellow-800 text-sm">
            <strong>Important Disclaimer:</strong> This platform provides educational insights
            and community-level data analysis only. It is NOT a substitute for professional
            medical or psychological diagnosis. If you are experiencing a mental health crisis,
            please contact emergency services or a mental health professional immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
