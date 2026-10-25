-- TalentHub Enterprise Supabase Database Migration
-- Target: PostgreSQL 17+ on Supabase

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proficiency_level AS ENUM ('junior', 'mid', 'senior', 'expert');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interview_status AS ENUM ('pending', 'accepted', 'declined', 'rejected', 'scheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('Free', 'Premium', 'Enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_workplace_type AS ENUM ('Remote', 'Hybrid', 'Onsite');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_application_status AS ENUM ('applied', 'reviewing', 'interview', 'offered', 'accepted', 'rejected', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE scholarship_application_status AS ENUM ('submitted', 'under_review', 'interview', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_code VARCHAR(20),
    verification_expires TIMESTAMPTZ,
    reset_password_token VARCHAR(128),
    reset_password_expires TIMESTAMPTZ,
    login_otp_code VARCHAR(20),
    login_otp_expires TIMESTAMPTZ,
    login_otp_attempts INT DEFAULT 0,
    last_otp_sent_at TIMESTAMPTZ,
    phone VARCHAR(50),
    company_name VARCHAR(200),
    company_website VARCHAR(255),
    company_size VARCHAR(50),
    company_registration_number VARCHAR(100),
    hr_job_title VARCHAR(150),
    location VARCHAR(150),
    authorized_declaration_accepted BOOLEAN DEFAULT FALSE,
    hr_verified BOOLEAN DEFAULT FALSE,
    hr_verification_status VARCHAR(50) DEFAULT 'pending_review',
    hr_verification_tier VARCHAR(50),
    hr_verification_method VARCHAR(50),
    hr_linkedin_url VARCHAR(512),
    company_linkedin_url VARCHAR(512),
    company_id_doc_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 4. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. CANDIDATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.candidate_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    headline VARCHAR(255),
    about_me TEXT,
    location VARCHAR(150),
    nationality VARCHAR(100) DEFAULT 'Indonesian',
    avatar VARCHAR(1024),
    cover_image VARCHAR(1024),
    website VARCHAR(512),
    github VARCHAR(512),
    linkedin VARCHAR(512),
    expected_salary VARCHAR(100),
    expected_salary_min NUMERIC(15, 2) DEFAULT 0,
    expected_salary_max NUMERIC(15, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    availability VARCHAR(50) DEFAULT 'Immediate',
    employment_type JSONB DEFAULT '["Full-time"]'::jsonb,
    preferred_location VARCHAR(150) DEFAULT 'Remote',
    open_to_work BOOLEAN DEFAULT TRUE,
    remote BOOLEAN DEFAULT TRUE,
    hybrid BOOLEAN DEFAULT TRUE,
    onsite BOOLEAN DEFAULT FALSE,
    relocation BOOLEAN DEFAULT FALSE,
    profile_completion INT DEFAULT 50,
    verified BOOLEAN DEFAULT FALSE,
    ats_score INT DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    video_url VARCHAR(1024),
    resume_url VARCHAR(1024),
    email_verified BOOLEAN DEFAULT FALSE,
    membership_plan VARCHAR(20) DEFAULT 'Free',
    ai_ats_quota_used INT DEFAULT 0,
    ai_ats_quota_limit INT DEFAULT 3,
    skills JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    portfolio JSONB DEFAULT '[]'::jsonb,
    enrolled_trainings JSONB DEFAULT '[]'::jsonb,
    scholarship_applications JSONB DEFAULT '[]'::jsonb,
    notification_preferences JSONB DEFAULT '{"interviewInvites": true, "directMessages": true, "jobRecommendations": true, "weeklyDigest": true, "urgentSourcingAlerts": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 6. RECRUITER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar VARCHAR(1024),
    hr_job_title VARCHAR(150),
    phone VARCHAR(50),
    company_name VARCHAR(200) NOT NULL,
    company_logo VARCHAR(1024),
    company_website VARCHAR(512),
    industry VARCHAR(150),
    location VARCHAR(150),
    company_size VARCHAR(50),
    company_registration_number VARCHAR(100),
    subscription_tier subscription_tier DEFAULT 'Free',
    saved_candidate_ids JSONB DEFAULT '[]'::jsonb,
    email_verified BOOLEAN DEFAULT FALSE,
    hr_verified BOOLEAN DEFAULT FALSE,
    hr_verification_status VARCHAR(50) DEFAULT 'pending_review',
    hr_verification_tier VARCHAR(50),
    hr_verification_method VARCHAR(50),
    hr_linkedin_url VARCHAR(512),
    company_linkedin_url VARCHAR(512),
    company_id_doc_name VARCHAR(255),
    authorized_declaration_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 7. NORMALIZED MASTER SKILLS TAXONOMY
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. NORMALIZED CANDIDATE SKILLS JUNCTION
CREATE TABLE IF NOT EXISTS public.candidate_skills (
    candidate_id TEXT NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
    years_experience NUMERIC(4, 1) NOT NULL DEFAULT 0,
    level proficiency_level NOT NULL DEFAULT 'intermediate',
    endorsements INT NOT NULL DEFAULT 0,
    PRIMARY KEY (candidate_id, skill_id)
);

-- 9. INVITATIONS (Recruiter Sourcing Pitches)
CREATE TABLE IF NOT EXISTS public.invitations (
    id TEXT PRIMARY KEY,
    recruiter_id TEXT NOT NULL,
    recruiter_name VARCHAR(150),
    company_name VARCHAR(200),
    company_logo VARCHAR(1024),
    candidate_id TEXT NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    position VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    salary_offer VARCHAR(100),
    interview_link VARCHAR(1024),
    scheduled_date TIMESTAMPTZ,
    status interview_status DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 10. MESSAGES (Direct Dialogue)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    invitation_id TEXT NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('candidate', 'recruiter')),
    content TEXT NOT NULL,
    attachment_name VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    candidate_id TEXT REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    time VARCHAR(50),
    unread BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. JOB OPENINGS
CREATE TABLE IF NOT EXISTS public.job_openings (
    id TEXT PRIMARY KEY,
    recruiter_id TEXT NOT NULL,
    recruiter_name VARCHAR(150),
    company_name VARCHAR(200) NOT NULL,
    company_logo VARCHAR(1024),
    company_website VARCHAR(512),
    title VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(150) NOT NULL,
    workplace_type job_workplace_type DEFAULT 'Remote',
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    experience_level VARCHAR(50) DEFAULT 'Mid-level',
    salary_min NUMERIC(15, 2) DEFAULT 0,
    salary_max NUMERIC(15, 2) DEFAULT 0,
    salary_formatted VARCHAR(100),
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    applicant_count INT DEFAULT 0,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 13. JOB APPLICATIONS
CREATE TABLE IF NOT EXISTS public.job_applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL REFERENCES public.job_openings(id) ON DELETE CASCADE,
    job_title VARCHAR(150) NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    company_logo VARCHAR(1024),
    recruiter_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    candidate_name VARCHAR(150) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(50),
    candidate_avatar VARCHAR(1024),
    candidate_headline VARCHAR(255),
    expected_salary VARCHAR(100),
    cover_note TEXT,
    resume_url VARCHAR(1024),
    portfolio_url VARCHAR(1024),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status job_application_status DEFAULT 'applied',
    interview_date TIMESTAMPTZ,
    meet_link VARCHAR(1024),
    offer_salary VARCHAR(100),
    offer_start_date TIMESTAMPTZ,
    offer_notes TEXT,
    expires_at TIMESTAMPTZ,
    is_expired BOOLEAN DEFAULT FALSE,
    expired_reason VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 14. TRAINING PROGRAMS
CREATE TABLE IF NOT EXISTS public.training_programs (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    provider_logo VARCHAR(1024),
    type VARCHAR(50) NOT NULL, -- Free, Government, NGO, Private, Paid
    price NUMERIC(12, 2) DEFAULT 0,
    price_formatted VARCHAR(100),
    platform_fee_rate NUMERIC(4, 2) DEFAULT 0.10,
    format VARCHAR(20) NOT NULL, -- Online, Offline, Hybrid
    category VARCHAR(50) NOT NULL, -- Coding, Design, Product, Data, Marketing, Language
    duration VARCHAR(50),
    schedule VARCHAR(255),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    certification BOOLEAN DEFAULT TRUE,
    certificate_issuer VARCHAR(200),
    description TEXT,
    image_url VARCHAR(1024),
    link VARCHAR(1024),
    requirements JSONB DEFAULT '[]'::jsonb,
    spots_left INT,
    total_spots INT,
    venue_name VARCHAR(200),
    venue_room VARCHAR(100),
    venue_address TEXT,
    venue_city VARCHAR(100),
    venue_google_maps_url VARCHAR(1024),
    venue_guidelines JSONB DEFAULT '[]'::jsonb,
    online_meeting_platform VARCHAR(100),
    online_meeting_url VARCHAR(1024),
    lms_url VARCHAR(1024),
    community_group_url VARCHAR(1024),
    session_recordings_url VARCHAR(1024),
    instructor_name VARCHAR(150),
    instructor_title VARCHAR(150),
    instructor_company VARCHAR(150),
    instructor_avatar VARCHAR(1024),
    syllabus JSONB DEFAULT '[]'::jsonb,
    recordings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. SCHOLARSHIPS
CREATE TABLE IF NOT EXISTS public.scholarships (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    amount VARCHAR(100),
    deadline VARCHAR(50),
    category VARCHAR(100),
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    link VARCHAR(1024),
    quota INT,
    applicant_count INT DEFAULT 0,
    selection_stage VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. INTERNSHIPS
CREATE TABLE IF NOT EXISTS public.internships (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location VARCHAR(150),
    type VARCHAR(50), -- Remote, Hybrid, Onsite
    duration VARCHAR(50),
    stipend VARCHAR(100),
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    link VARCHAR(1024),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. TRAINING PROPOSALS & INQUIRIES
CREATE TABLE IF NOT EXISTS public.training_proposals (
    id TEXT PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'training_proposal',
    partner_name VARCHAR(150) NOT NULL,
    institution_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    program_title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    program_type VARCHAR(50),
    format VARCHAR(20),
    duration VARCHAR(50),
    certification BOOLEAN DEFAULT TRUE,
    description TEXT,
    syllabus_overview TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    registration_link VARCHAR(1024),
    image_url VARCHAR(1024),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status proposal_status DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. SCHOLARSHIP APPLICATIONS
CREATE TABLE IF NOT EXISTS public.scholarship_applications (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    candidate_name VARCHAR(150) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(50),
    candidate_avatar VARCHAR(1024),
    training_id TEXT NOT NULL,
    training_title VARCHAR(255) NOT NULL,
    provider VARCHAR(200) NOT NULL,
    format VARCHAR(20),
    motivation_essay TEXT,
    career_goals TEXT,
    portfolio_url VARCHAR(1024),
    linkedin_url VARCHAR(1024),
    gpa_or_achievement VARCHAR(100),
    economic_background VARCHAR(100),
    weekly_commitment_hours INT DEFAULT 10,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status scholarship_application_status DEFAULT 'submitted',
    admin_feedback TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. RECRUITER BOOKMARKS (WATCHLIST)
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id TEXT PRIMARY KEY DEFAULT ('bm_' || gen_random_uuid()),
    recruiter_id TEXT NOT NULL,
    candidate_id TEXT NOT NULL REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (recruiter_id, candidate_id)
);

-- 20. ATS REPORTS
CREATE TABLE IF NOT EXISTS public.ats_reports (
    id TEXT PRIMARY KEY DEFAULT ('ats_' || gen_random_uuid()),
    candidate_id TEXT REFERENCES public.candidate_profiles(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    target_role VARCHAR(150),
    raw_resume_text TEXT NOT NULL,
    analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT ('log_' || gen_random_uuid()),
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id TEXT,
    old_state JSONB,
    new_state JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 22. HIGH-PERFORMANCE SEARCH & COMPOSITE INDICES
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_active_search ON public.candidate_profiles (id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_candidate_facets ON public.candidate_profiles (remote, location, ats_score DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_candidate_location_trgm ON public.candidate_profiles USING gin (location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_skills_name_trgm ON public.skills USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_invitations_candidate_status ON public.invitations (candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_invitations_recruiter_status ON public.invitations (recruiter_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_invitation ON public.messages (invitation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_candidate ON public.notifications (candidate_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_status ON public.job_openings (recruiter_id, status);
CREATE INDEX IF NOT EXISTS idx_job_apps_candidate ON public.job_applications (candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_job_apps_job ON public.job_applications (job_id, status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_recruiter ON public.bookmarks (recruiter_id);

-- 23. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_users ON public.users;
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_candidate_profiles ON public.candidate_profiles;
CREATE TRIGGER set_timestamp_candidate_profiles
BEFORE UPDATE ON public.candidate_profiles
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_recruiter_profiles ON public.recruiter_profiles;
CREATE TRIGGER set_timestamp_recruiter_profiles
BEFORE UPDATE ON public.recruiter_profiles
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_invitations ON public.invitations;
CREATE TRIGGER set_timestamp_invitations
BEFORE UPDATE ON public.invitations
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_job_openings ON public.job_openings;
CREATE TRIGGER set_timestamp_job_openings
BEFORE UPDATE ON public.job_openings
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_job_applications ON public.job_applications;
CREATE TRIGGER set_timestamp_job_applications
BEFORE UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- 24. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ ACCESS POLICIES
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_reports ENABLE ROW LEVEL SECURITY;

-- Grant public read for discovery catalogs (Anon key access)
DROP POLICY IF EXISTS "Public read candidate profiles" ON public.candidate_profiles;
CREATE POLICY "Public read candidate profiles" ON public.candidate_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read training programs" ON public.training_programs;
CREATE POLICY "Public read training programs" ON public.training_programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read scholarships" ON public.scholarships;
CREATE POLICY "Public read scholarships" ON public.scholarships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read internships" ON public.internships;
CREATE POLICY "Public read internships" ON public.internships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read job openings" ON public.job_openings;
CREATE POLICY "Public read job openings" ON public.job_openings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read recruiter profiles" ON public.recruiter_profiles;
CREATE POLICY "Public read recruiter profiles" ON public.recruiter_profiles FOR SELECT USING (true);

-- Allow authenticated/anon insert & update for client interaction
DROP POLICY IF EXISTS "Allow candidate profile updates" ON public.candidate_profiles;
CREATE POLICY "Allow candidate profile updates" ON public.candidate_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow recruiter profile updates" ON public.recruiter_profiles;
CREATE POLICY "Allow recruiter profile updates" ON public.recruiter_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow invitations access" ON public.invitations;
CREATE POLICY "Allow invitations access" ON public.invitations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow messages access" ON public.messages;
CREATE POLICY "Allow messages access" ON public.messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow notifications access" ON public.notifications;
CREATE POLICY "Allow notifications access" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow job applications access" ON public.job_applications;
CREATE POLICY "Allow job applications access" ON public.job_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow proposals access" ON public.training_proposals;
CREATE POLICY "Allow proposals access" ON public.training_proposals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow scholarship applications access" ON public.scholarship_applications;
CREATE POLICY "Allow scholarship applications access" ON public.scholarship_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow bookmarks access" ON public.bookmarks;
CREATE POLICY "Allow bookmarks access" ON public.bookmarks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow ats reports access" ON public.ats_reports;
CREATE POLICY "Allow ats reports access" ON public.ats_reports FOR ALL USING (true) WITH CHECK (true);
