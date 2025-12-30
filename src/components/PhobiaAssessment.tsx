import { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PHOBIA_TYPES, type PhobiaType, type PhobiaAssessment } from '../types';

interface Question {
  id: keyof Omit<PhobiaAssessment, 'intensity_percentage' | 'risk_level' | 'region' | 'age_group'>;
  question: string;
  labels: string[];
}

const questions: Question[] = [
  {
    id: 'frequency_of_fear',
    question: 'How often do you experience fear related to this phobia?',
    labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'avoidance_level',
    question: 'How much do you avoid situations related to this fear?',
    labels: ['Never Avoid', 'Rarely Avoid', 'Sometimes Avoid', 'Often Avoid', 'Always Avoid']
  },
  {
    id: 'physical_symptoms_intensity',
    question: 'How intense are your physical symptoms (sweating, rapid heartbeat, trembling)?',
    labels: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme']
  },
  {
    id: 'interference_with_life',
    question: 'How much does this fear interfere with your daily life?',
    labels: ['Not at all', 'A little', 'Moderately', 'Significantly', 'Completely']
  }
];

interface PhobiaAssessmentProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function PhobiaAssessment({ onBack, onComplete }: PhobiaAssessmentProps) {
  const [selectedPhobia, setSelectedPhobia] = useState<PhobiaType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [durationMonths, setDurationMonths] = useState('');
  const [region, setRegion] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [showDemographics, setShowDemographics] = useState(false);
  const [result, setResult] = useState<{ intensity: number; risk: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhobiaSelect = (phobia: PhobiaType) => {
    setSelectedPhobia(phobia);
  };

  const handleResponse = (value: number) => {
    setResponses({ ...responses, [questions[currentQuestion].id]: value });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowDemographics(true);
    }
  };

  const calculateIntensity = () => {
    const values = Object.values(responses);
    const totalScore = values.reduce((sum, val) => sum + val, 0);
    const maxScore = values.length * 5;
    return Math.round((totalScore / maxScore) * 100);
  };

  const getRiskLevel = (intensity: number): 'Low' | 'Medium' | 'High' | 'Severe' => {
    if (intensity < 25) return 'Low';
    if (intensity < 50) return 'Medium';
    if (intensity < 75) return 'High';
    return 'Severe';
  };

  const handleSubmit = async () => {
    if (!region || !ageGroup || !durationMonths || !selectedPhobia) return;

    setIsSubmitting(true);
    const intensity = calculateIntensity();
    const riskLevel = getRiskLevel(intensity);

    const data: PhobiaAssessment = {
      ...responses as any,
      duration_months: parseInt(durationMonths),
      intensity_percentage: intensity,
      risk_level: riskLevel,
      region,
      age_group: ageGroup
    };

    try {
      const { error } = await supabase
        .from(selectedPhobia.table)
        .insert([data]);

      if (error) throw error;

      setResult({ intensity, risk: riskLevel });
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result && selectedPhobia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete</h2>
            <p className="text-xl text-gray-600 mb-6">{selectedPhobia.medicalTerm}</p>
            <div className="mb-8">
              <div className="text-6xl font-bold text-orange-600 mb-2">{result.intensity}%</div>
              <p className="text-xl text-gray-600">Phobia Intensity</p>
              <div className={`inline-block mt-4 px-6 py-2 rounded-full text-white font-semibold ${
                result.risk === 'Low' ? 'bg-green-500' :
                result.risk === 'Medium' ? 'bg-yellow-500' :
                result.risk === 'High' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {result.risk} Risk Level
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Educational Guidance:</h3>
              <ul className="space-y-2 text-gray-700">
                {result.risk === 'Severe' || result.risk === 'High' ? (
                  <>
                    <li>• Consider consulting with a mental health professional</li>
                    <li>• Cognitive Behavioral Therapy (CBT) has shown effectiveness</li>
                    <li>• Exposure therapy may be beneficial under professional guidance</li>
                    <li>• Join support groups for individuals with similar experiences</li>
                  </>
                ) : result.risk === 'Medium' ? (
                  <>
                    <li>• Practice relaxation techniques when confronting your fear</li>
                    <li>• Gradual exposure to the fear source can help build tolerance</li>
                    <li>• Consider speaking with a therapist if symptoms worsen</li>
                    <li>• Learn about your phobia to better understand it</li>
                  </>
                ) : (
                  <>
                    <li>• Your fear level is relatively manageable</li>
                    <li>• Continue healthy coping strategies</li>
                    <li>• Stay informed about your fear triggers</li>
                    <li>• Monitor for any changes in intensity</li>
                  </>
                )}
              </ul>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This is an educational assessment, not a clinical diagnosis. Consult a healthcare professional for proper evaluation.
            </p>
            <button
              onClick={onComplete}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Almost Done!</h2>
            <p className="text-gray-600 mb-8">
              Please provide some additional information to complete your assessment.
            </p>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  How long have you experienced this fear? (months)
                </label>
                <input
                  type="number"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  placeholder="e.g., 12"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., Northeast, California, London"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Age Group</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                disabled={!region || !ageGroup || !durationMonths || isSubmitting}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedPhobia) {
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedPhobia(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Change Phobia Type
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-orange-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">Assessing:</p>
              <p className="font-bold text-gray-900">{selectedPhobia.medicalTerm}</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-3">
              {questions[currentQuestion].labels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(index + 1)}
                  className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
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
                className="mt-6 text-orange-600 hover:text-orange-700 font-semibold"
              >
                Previous Question
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Phobia Assessment</h2>
          <p className="text-xl text-gray-600">
            Select the type of phobia you would like to assess:
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHOBIA_TYPES.map((phobia) => (
            <button
              key={phobia.id}
              onClick={() => handlePhobiaSelect(phobia)}
              className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-orange-500"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{phobia.medicalTerm}</h3>
              <p className="text-sm text-orange-600 font-semibold mb-2">{phobia.name}</p>
              <p className="text-gray-600 text-sm">{phobia.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
