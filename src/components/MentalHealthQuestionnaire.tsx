import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { MentalHealthResponse } from '../types';

interface Question {
  id: keyof Omit<MentalHealthResponse, 'wellness_score' | 'severity_category' | 'region' | 'age_group'>;
  question: string;
  labels: string[];
}

const questions: Question[] = [
  {
    id: 'stress_level',
    question: 'How would you rate your overall stress level in the past week?',
    labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
  },
  {
    id: 'anxiety_level',
    question: 'How often have you felt anxious or worried?',
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'mood_level',
    question: 'How would you describe your general mood?',
    labels: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent']
  },
  {
    id: 'sleep_quality',
    question: 'How would you rate your sleep quality?',
    labels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
  },
  {
    id: 'focus_ability',
    question: 'How easily can you concentrate and focus on tasks?',
    labels: ['Very Difficult', 'Difficult', 'Moderate', 'Easy', 'Very Easy']
  },
  {
    id: 'emotional_regulation',
    question: 'How well can you manage and control your emotions?',
    labels: ['Very Poorly', 'Poorly', 'Moderately', 'Well', 'Very Well']
  },
  {
    id: 'social_connection',
    question: 'How connected do you feel to friends, family, or community?',
    labels: ['Very Isolated', 'Isolated', 'Neutral', 'Connected', 'Very Connected']
  },
  {
    id: 'physical_energy',
    question: 'How would you rate your physical energy levels?',
    labels: ['Exhausted', 'Low', 'Moderate', 'High', 'Very High']
  },
  {
    id: 'motivation_level',
    question: 'How motivated do you feel to accomplish daily tasks?',
    labels: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
  },
  {
    id: 'appetite_changes',
    question: 'Have you noticed any changes in your appetite?',
    labels: ['Significant Loss', 'Some Loss', 'No Change', 'Some Increase', 'Significant Increase']
  },
  {
    id: 'intrusive_thoughts',
    question: 'How often do you experience unwanted or intrusive thoughts?',
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Constantly']
  },
  {
    id: 'hopelessness_feeling',
    question: 'How often do you feel hopeless about the future?',
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

interface MentalHealthQuestionnaireProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function MentalHealthQuestionnaire({ onBack, onComplete }: MentalHealthQuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [region, setRegion] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [showDemographics, setShowDemographics] = useState(false);
  const [result, setResult] = useState<{ score: number; category: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (value: number) => {
    setResponses({ ...responses, [questions[currentQuestion].id]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowDemographics(true);
    }
  };

  const calculateWellnessScore = () => {
    const values = Object.values(responses);
    const totalScore = values.reduce((sum, val) => sum + val, 0);
    const maxScore = values.length * 5;
    const normalizedScore = (totalScore / maxScore) * 100;
    return Math.round(normalizedScore);
  };

  const getSeverityCategory = (score: number): 'Stable' | 'Mild' | 'Moderate' | 'Severe' => {
    if (score >= 75) return 'Stable';
    if (score >= 50) return 'Mild';
    if (score >= 25) return 'Moderate';
    return 'Severe';
  };

  const handleSubmit = async () => {
    if (!region || !ageGroup) return;

    setIsSubmitting(true);
    const wellnessScore = calculateWellnessScore();
    const severityCategory = getSeverityCategory(wellnessScore);

    const data: MentalHealthResponse = {
      ...responses as any,
      wellness_score: wellnessScore,
      severity_category: severityCategory,
      region,
      age_group: ageGroup
    };

    try {
      const { error } = await supabase
        .from('mental_health_responses')
        .insert([data]);

      if (error) throw error;

      setResult({ score: wellnessScore, category: severityCategory });
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete</h2>
            <div className="mb-8">
              <div className="text-6xl font-bold text-purple-600 mb-2">{result.score}</div>
              <p className="text-xl text-gray-600">Mental Wellness Score</p>
              <div className={`inline-block mt-4 px-6 py-2 rounded-full text-white font-semibold ${
                result.category === 'Stable' ? 'bg-green-500' :
                result.category === 'Mild' ? 'bg-yellow-500' :
                result.category === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {result.category}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Personalized Recommendations:</h3>
              <ul className="space-y-2 text-gray-700">
                {result.score < 50 && (
                  <>
                    <li>• Consider speaking with a mental health professional</li>
                    <li>• Practice daily mindfulness or meditation</li>
                    <li>• Maintain a regular sleep schedule</li>
                  </>
                )}
                {result.score >= 50 && result.score < 75 && (
                  <>
                    <li>• Continue healthy habits that support your wellbeing</li>
                    <li>• Stay connected with supportive friends and family</li>
                    <li>• Engage in regular physical activity</li>
                  </>
                )}
                {result.score >= 75 && (
                  <>
                    <li>• Keep up your excellent self-care practices</li>
                    <li>• Share your wellness strategies with others</li>
                    <li>• Continue monitoring your mental health</li>
                  </>
                )}
              </ul>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This is not a clinical diagnosis. If you're experiencing distress, please consult a healthcare professional.
            </p>
            <button
              onClick={onComplete}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDemographics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Almost Done!</h2>
            <p className="text-gray-600 mb-8">
              Please provide some anonymous demographic information to help us analyze community trends.
            </p>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., Northeast, California, London"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Age Group</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select age group</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!region || !ageGroup || isSubmitting}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-purple-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].labels.map((label, index) => (
              <button
                key={index}
                onClick={() => handleResponse(index + 1)}
                className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-6 text-purple-600 hover:text-purple-700 font-semibold"
            >
              Previous Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
