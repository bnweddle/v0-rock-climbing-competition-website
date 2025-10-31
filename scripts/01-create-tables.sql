-- Competition Settings
CREATE TABLE IF NOT EXISTS competition_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Age Tiers
CREATE TABLE IF NOT EXISTS age_tiers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_age INT,
  max_age INT,
  display_order INT DEFAULT 0
);

-- Categories (Wall Tops, Routes, Speed)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

-- Routes (for Routes category)
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  name VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50),
  points INT DEFAULT 0,
  display_order INT DEFAULT 0,
  checkpoint1_multiplier DECIMAL(3,2) DEFAULT 0.2,
  checkpoint2_multiplier DECIMAL(3,2) DEFAULT 0.6
);

-- Wall Tops (for Wall Tops category)
CREATE TABLE IF NOT EXISTS wall_tops (
  id SERIAL PRIMARY KEY,
  wall_number INT NOT NULL,
  points INT DEFAULT 0,
  difficulty VARCHAR(50),
  checkpoint1_multiplier DECIMAL(3,2) DEFAULT 0.2,
  checkpoint2_multiplier DECIMAL(3,2) DEFAULT 0.6
);

-- Bonus Points
CREATE TABLE IF NOT EXISTS bonuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points INT DEFAULT 100,
  is_active BOOLEAN DEFAULT true
);

-- Participants
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  age INT,
  gender VARCHAR(20),
  age_tier_id INT REFERENCES age_tiers(id),
  costume_photo_url TEXT,
  total_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participant Climbs
CREATE TABLE IF NOT EXISTS participant_climbs (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES participants(id),
  category_id INT REFERENCES categories(id),
  route_id INT REFERENCES routes(id),
  wall_top_id INT REFERENCES wall_tops(id),
  points_earned INT DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  speed_time VARCHAR(20),
  checkpoint_reached VARCHAR(20),
  completion_count INT DEFAULT 1
);

-- Participant Bonuses
CREATE TABLE IF NOT EXISTS participant_bonuses (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES participants(id),
  bonus_id INT REFERENCES bonuses(id),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant_id, bonus_id)
);

-- Costume Votes
CREATE TABLE IF NOT EXISTS costume_votes (
  id SERIAL PRIMARY KEY,
  participant_id INT REFERENCES participants(id),
  voter_email VARCHAR(255) NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant_id, voter_email)
);
