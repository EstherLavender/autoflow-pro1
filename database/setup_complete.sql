-- AutoFlow Pro - Complete Database Setup with KYC
-- Run this file to set up or update your database

-- First, run the original schema
\i database/schema.sql

-- Then, add KYC schema
\i database/kyc_schema.sql

-- Verify all tables exist
SELECT 
    table_name,
    table_type
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public'
    AND table_name LIKE '%kyc%'
ORDER BY 
    table_name;

-- Show summary
SELECT 
    'Total Tables Created' as status,
    COUNT(*) as count
FROM 
    information_schema.tables
WHERE 
    table_schema = 'public';

ECHO '\nKYC Schema Setup Complete!';
ECHO 'The following KYC tables have been created:';
ECHO '- kyc_documents';
ECHO '- kyc_profiles';
ECHO '- biometric_verifications';
ECHO '- phone_verifications';
ECHO '- email_verifications';
ECHO '- kyc_audit_log';
ECHO '\nYou can now restart your backend server and start testing!';
