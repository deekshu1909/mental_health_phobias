/*
  # Mental Health and Phobia Surveillance System Database Schema

  ## Overview
  This migration creates the complete database structure for the AI-Powered Crowdsourced 
  Disease Surveillance System with separate tables for mental health responses and 
  different phobia assessments.

  ## New Tables

  ### 1. mental_health_responses
  Stores comprehensive mental health questionnaire responses (12+ questions)
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable - for anonymous submissions)
  - `stress_level` (integer, 1-5 scale)
  - `anxiety_level` (integer, 1-5 scale)
  - `mood_level` (integer, 1-5 scale)
  - `sleep_quality` (integer, 1-5 scale)
  - `focus_ability` (integer, 1-5 scale)
  - `emotional_regulation` (integer, 1-5 scale)
  - `social_connection` (integer, 1-5 scale)
  - `physical_energy` (integer, 1-5 scale)
  - `motivation_level` (integer, 1-5 scale)
  - `appetite_changes` (integer, 1-5 scale)
  - `intrusive_thoughts` (integer, 1-5 scale)
  - `hopelessness_feeling` (integer, 1-5 scale)
  - `wellness_score` (numeric, calculated 0-100)
  - `severity_category` (text, Stable/Mild/Moderate/Severe)
  - `region` (text, user's region)
  - `age_group` (text, age bracket)
  - `submitted_at` (timestamp)

  ### 2. acrophobia_assessments (Fear of Heights)
  - Standard phobia assessment fields

  ### 3. agoraphobia_assessments (Fear of Open/Crowded Spaces)
  - Standard phobia assessment fields

  ### 4. social_phobia_assessments (Fear of Social Situations)
  - Standard phobia assessment fields

  ### 5. claustrophobia_assessments (Fear of Confined Spaces)
  - Standard phobia assessment fields

  ### 6. arachnophobia_assessments (Fear of Spiders)
  - Standard phobia assessment fields

  ### 7. ophidiophobia_assessments (Fear of Snakes)
  - Standard phobia assessment fields

  ### 8. aerophobia_assessments (Fear of Flying)
  - Standard phobia assessment fields

  ### 9. hemophobia_assessments (Fear of Blood)
  - Standard phobia assessment fields

  ### 10. cynophobia_assessments (Fear of Dogs)
  - Standard phobia assessment fields

  ### 11. aquaphobia_assessments (Fear of Water)
  - Standard phobia assessment fields

  ## Security
  - All tables have RLS enabled
  - Public can insert anonymously
  - Public can read aggregated data (for dashboards)
  - Only authenticated admins can update/delete
*/

-- Mental Health Responses Table
CREATE TABLE IF NOT EXISTS mental_health_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  stress_level integer NOT NULL CHECK (stress_level >= 1 AND stress_level <= 5),
  anxiety_level integer NOT NULL CHECK (anxiety_level >= 1 AND anxiety_level <= 5),
  mood_level integer NOT NULL CHECK (mood_level >= 1 AND mood_level <= 5),
  sleep_quality integer NOT NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  focus_ability integer NOT NULL CHECK (focus_ability >= 1 AND focus_ability <= 5),
  emotional_regulation integer NOT NULL CHECK (emotional_regulation >= 1 AND emotional_regulation <= 5),
  social_connection integer NOT NULL CHECK (social_connection >= 1 AND social_connection <= 5),
  physical_energy integer NOT NULL CHECK (physical_energy >= 1 AND physical_energy <= 5),
  motivation_level integer NOT NULL CHECK (motivation_level >= 1 AND motivation_level <= 5),
  appetite_changes integer NOT NULL CHECK (appetite_changes >= 1 AND appetite_changes <= 5),
  intrusive_thoughts integer NOT NULL CHECK (intrusive_thoughts >= 1 AND intrusive_thoughts <= 5),
  hopelessness_feeling integer NOT NULL CHECK (hopelessness_feeling >= 1 AND hopelessness_feeling <= 5),
  wellness_score numeric NOT NULL CHECK (wellness_score >= 0 AND wellness_score <= 100),
  severity_category text NOT NULL CHECK (severity_category IN ('Stable', 'Mild', 'Moderate', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- Phobia Assessment Template (repeated for each phobia type)
-- Common fields for all phobia assessments:
-- id, user_id, frequency_of_fear, avoidance_level, physical_symptoms_intensity, 
-- interference_with_life, duration_months, intensity_percentage, risk_level, 
-- region, age_group, submitted_at

-- 1. Acrophobia (Fear of Heights)
CREATE TABLE IF NOT EXISTS acrophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 2. Agoraphobia (Fear of Open/Crowded Spaces)
CREATE TABLE IF NOT EXISTS agoraphobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 3. Social Phobia (Fear of Social Situations)
CREATE TABLE IF NOT EXISTS social_phobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 4. Claustrophobia (Fear of Confined Spaces)
CREATE TABLE IF NOT EXISTS claustrophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 5. Arachnophobia (Fear of Spiders)
CREATE TABLE IF NOT EXISTS arachnophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 6. Ophidiophobia (Fear of Snakes)
CREATE TABLE IF NOT EXISTS ophidiophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 7. Aerophobia (Fear of Flying)
CREATE TABLE IF NOT EXISTS aerophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 8. Hemophobia (Fear of Blood)
CREATE TABLE IF NOT EXISTS hemophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 9. Cynophobia (Fear of Dogs)
CREATE TABLE IF NOT EXISTS cynophobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- 10. Aquaphobia (Fear of Water)
CREATE TABLE IF NOT EXISTS aquaphobia_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  frequency_of_fear integer NOT NULL CHECK (frequency_of_fear >= 1 AND frequency_of_fear <= 5),
  avoidance_level integer NOT NULL CHECK (avoidance_level >= 1 AND avoidance_level <= 5),
  physical_symptoms_intensity integer NOT NULL CHECK (physical_symptoms_intensity >= 1 AND physical_symptoms_intensity <= 5),
  interference_with_life integer NOT NULL CHECK (interference_with_life >= 1 AND interference_with_life <= 5),
  duration_months integer NOT NULL DEFAULT 0,
  intensity_percentage numeric NOT NULL CHECK (intensity_percentage >= 0 AND intensity_percentage <= 100),
  risk_level text NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Severe')),
  region text NOT NULL DEFAULT '',
  age_group text NOT NULL DEFAULT '',
  submitted_at timestamptz DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE mental_health_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE acrophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agoraphobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_phobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE claustrophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE arachnophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophidiophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aerophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hemophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cynophobia_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aquaphobia_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Mental Health Responses
CREATE POLICY "Anyone can submit mental health responses"
  ON mental_health_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view mental health data for analytics"
  ON mental_health_responses FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Acrophobia
CREATE POLICY "Anyone can submit acrophobia assessments"
  ON acrophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view acrophobia data for analytics"
  ON acrophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Agoraphobia
CREATE POLICY "Anyone can submit agoraphobia assessments"
  ON agoraphobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view agoraphobia data for analytics"
  ON agoraphobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Social Phobia
CREATE POLICY "Anyone can submit social phobia assessments"
  ON social_phobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view social phobia data for analytics"
  ON social_phobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Claustrophobia
CREATE POLICY "Anyone can submit claustrophobia assessments"
  ON claustrophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view claustrophobia data for analytics"
  ON claustrophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Arachnophobia
CREATE POLICY "Anyone can submit arachnophobia assessments"
  ON arachnophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view arachnophobia data for analytics"
  ON arachnophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Ophidiophobia
CREATE POLICY "Anyone can submit ophidiophobia assessments"
  ON ophidiophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view ophidiophobia data for analytics"
  ON ophidiophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Aerophobia
CREATE POLICY "Anyone can submit aerophobia assessments"
  ON aerophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view aerophobia data for analytics"
  ON aerophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Hemophobia
CREATE POLICY "Anyone can submit hemophobia assessments"
  ON hemophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view hemophobia data for analytics"
  ON hemophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Cynophobia
CREATE POLICY "Anyone can submit cynophobia assessments"
  ON cynophobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view cynophobia data for analytics"
  ON cynophobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for Aquaphobia
CREATE POLICY "Anyone can submit aquaphobia assessments"
  ON aquaphobia_assessments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view aquaphobia data for analytics"
  ON aquaphobia_assessments FOR SELECT
  TO anon, authenticated
  USING (true);