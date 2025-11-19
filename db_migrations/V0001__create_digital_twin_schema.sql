-- Digital Twin Database Schema

-- User profile with core personality data
CREATE TABLE IF NOT EXISTS user_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    location VARCHAR(255),
    occupation VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personality traits and psychological profile
CREATE TABLE IF NOT EXISTS personality_traits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    trait_name VARCHAR(100) NOT NULL,
    trait_value INTEGER CHECK (trait_value >= 0 AND trait_value <= 100),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge base about the user
CREATE TABLE IF NOT EXISTS knowledge_base (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    category VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    importance INTEGER CHECK (importance >= 1 AND importance <= 5) DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat conversations history
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    title VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Behavioral patterns learned from interactions
CREATE TABLE IF NOT EXISTS behavior_patterns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    situation_type VARCHAR(100) NOT NULL,
    context TEXT NOT NULL,
    typical_response TEXT NOT NULL,
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    times_observed INTEGER DEFAULT 1,
    last_observed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Decision making scenarios and responses
CREATE TABLE IF NOT EXISTS decision_scenarios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    scenario_title VARCHAR(255) NOT NULL,
    scenario_description TEXT NOT NULL,
    user_decision TEXT,
    reasoning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences and likes/dislikes
CREATE TABLE IF NOT EXISTS preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    category VARCHAR(100) NOT NULL,
    item VARCHAR(255) NOT NULL,
    preference_type VARCHAR(20) CHECK (preference_type IN ('like', 'dislike', 'neutral')),
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) DEFAULT 3,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning sessions and training data
CREATE TABLE IF NOT EXISTS training_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profile(id),
    session_type VARCHAR(50) NOT NULL,
    data_points INTEGER DEFAULT 0,
    improvement_score FLOAT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Insert default user profile
INSERT INTO user_profile (name, location, bio) 
VALUES (
    'Пользователь',
    'Россия',
    'Цифровой двойник в процессе обучения'
);

-- Insert default personality traits
INSERT INTO personality_traits (user_id, trait_name, trait_value, description)
VALUES
    (1, 'Аналитичность', 85, 'Способность к логическому мышлению и анализу'),
    (1, 'Эмпатия', 80, 'Способность понимать эмоции других'),
    (1, 'Креативность', 75, 'Творческий подход к решению задач'),
    (1, 'Решительность', 82, 'Способность принимать быстрые решения'),
    (1, 'Адаптивность', 88, 'Гибкость в изменяющихся условиях'),
    (1, 'Экстраверсия', 60, 'Общительность и социальная активность'),
    (1, 'Открытость опыту', 90, 'Готовность к новым идеям и опыту'),
    (1, 'Добросовестность', 85, 'Организованность и ответственность'),
    (1, 'Эмоциональная стабильность', 78, 'Устойчивость к стрессу'),
    (1, 'Оптимизм', 83, 'Позитивный взгляд на жизнь');

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_knowledge_category ON knowledge_base(category);
CREATE INDEX idx_behavior_situation ON behavior_patterns(situation_type);
CREATE INDEX idx_conversations_user ON conversations(user_id);
