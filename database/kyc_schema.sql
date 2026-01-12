-- KYC (Know Your Customer) Verification Schema

-- KYC Documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('national_id', 'passport', 'drivers_license', 'business_license', 'tax_certificate', 'bank_statement', 'proof_of_address')),
    document_number VARCHAR(100),
    front_image_url TEXT NOT NULL,
    back_image_url TEXT,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC Profiles table (user type specific information)
CREATE TABLE IF NOT EXISTS kyc_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    national_id VARCHAR(50),
    phone_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Kenya',
    -- Customer specific
    preferred_payment_method VARCHAR(50),
    -- Detailer specific
    years_of_experience INTEGER,
    certifications TEXT[],
    insurance_number VARCHAR(100),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    -- Car Wash Owner specific
    business_name VARCHAR(255),
    business_registration_number VARCHAR(100),
    tax_identification_number VARCHAR(100),
    number_of_employees INTEGER,
    business_address TEXT,
    operating_hours JSONB,
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    -- Verification status
    kyc_status VARCHAR(50) NOT NULL DEFAULT 'incomplete' CHECK (kyc_status IN ('incomplete', 'pending_review', 'verified', 'rejected')),
    kyc_submitted_at TIMESTAMP WITH TIME ZONE,
    kyc_reviewed_at TIMESTAMP WITH TIME ZONE,
    kyc_reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometric verification data (for face matching with ID)
CREATE TABLE IF NOT EXISTS biometric_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL CHECK (verification_type IN ('face_match', 'liveness_check')),
    selfie_image_url TEXT NOT NULL,
    confidence_score DECIMAL(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
    verification_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phone verification OTP
CREATE TABLE IF NOT EXISTS phone_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for KYC changes
CREATE TABLE IF NOT EXISTS kyc_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    changed_by UUID REFERENCES users(id),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_kyc_profiles_user ON kyc_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_profiles_status ON kyc_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_biometric_verifications_user ON biometric_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_user ON phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_user ON kyc_audit_log(user_id);

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON kyc_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kyc_profiles_updated_at BEFORE UPDATE ON kyc_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
