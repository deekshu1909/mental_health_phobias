export interface MentalHealthResponse {
  stress_level: number;
  anxiety_level: number;
  mood_level: number;
  sleep_quality: number;
  focus_ability: number;
  emotional_regulation: number;
  social_connection: number;
  physical_energy: number;
  motivation_level: number;
  appetite_changes: number;
  intrusive_thoughts: number;
  hopelessness_feeling: number;
  wellness_score: number;
  severity_category: 'Stable' | 'Mild' | 'Moderate' | 'Severe';
  region: string;
  age_group: string;
}

export interface PhobiaAssessment {
  frequency_of_fear: number;
  avoidance_level: number;
  physical_symptoms_intensity: number;
  interference_with_life: number;
  duration_months: number;
  intensity_percentage: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Severe';
  region: string;
  age_group: string;
}

export interface PhobiaType {
  id: string;
  name: string;
  medicalTerm: string;
  description: string;
  table: string;
}

export const PHOBIA_TYPES: PhobiaType[] = [
  {
    id: 'acrophobia',
    name: 'Fear of Heights',
    medicalTerm: 'Acrophobia',
    description: 'Extreme or irrational fear of heights',
    table: 'acrophobia_assessments'
  },
  {
    id: 'agoraphobia',
    name: 'Fear of Open or Crowded Spaces',
    medicalTerm: 'Agoraphobia',
    description: 'Fear of situations where escape might be difficult',
    table: 'agoraphobia_assessments'
  },
  {
    id: 'social_phobia',
    name: 'Fear of Social Situations',
    medicalTerm: 'Social Phobia (Social Anxiety Disorder)',
    description: 'Intense fear of social or performance situations',
    table: 'social_phobia_assessments'
  },
  {
    id: 'claustrophobia',
    name: 'Fear of Confined Spaces',
    medicalTerm: 'Claustrophobia',
    description: 'Fear of enclosed or tight spaces',
    table: 'claustrophobia_assessments'
  },
  {
    id: 'arachnophobia',
    name: 'Fear of Spiders',
    medicalTerm: 'Arachnophobia',
    description: 'Extreme or irrational fear of spiders',
    table: 'arachnophobia_assessments'
  },
  {
    id: 'ophidiophobia',
    name: 'Fear of Snakes',
    medicalTerm: 'Ophidiophobia',
    description: 'Extreme fear of snakes',
    table: 'ophidiophobia_assessments'
  },
  {
    id: 'aerophobia',
    name: 'Fear of Flying',
    medicalTerm: 'Aerophobia',
    description: 'Fear of flying or air travel',
    table: 'aerophobia_assessments'
  },
  {
    id: 'hemophobia',
    name: 'Fear of Blood',
    medicalTerm: 'Hemophobia',
    description: 'Extreme fear of blood',
    table: 'hemophobia_assessments'
  },
  {
    id: 'cynophobia',
    name: 'Fear of Dogs',
    medicalTerm: 'Cynophobia',
    description: 'Fear of dogs or canines',
    table: 'cynophobia_assessments'
  },
  {
    id: 'aquaphobia',
    name: 'Fear of Water',
    medicalTerm: 'Aquaphobia',
    description: 'Fear of water, particularly large bodies of water',
    table: 'aquaphobia_assessments'
  }
];
