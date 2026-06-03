-- ZATCA Phase 2 Module: Additional Migration
-- Run this after the existing migrations if tables are missing
-- Note: Most ZATCA tables already exist in 0000_strange_gauntlet.sql

-- ============================================
-- 1. Company Legal Details (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `company_legal_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL UNIQUE,
  `legal_name_en` varchar(255) NOT NULL,
  `legal_name_ar` varchar(255),
  `vat_number` varchar(15) NOT NULL,
  `cr_number` varchar(100),
  `tax_registration_number` varchar(100),
  `business_activity` varchar(255),
  `company_address` text,
  `building_number` varchar(20),
  `street_name` varchar(255),
  `district` varchar(255),
  `city` varchar(100),
  `postal_code` varchar(20),
  `country` varchar(100) DEFAULT 'Saudi Arabia' NOT NULL,
  `contact_person` varchar(255),
  `phone_number` varchar(50),
  `email_address` varchar(320),
  `company_logo` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `company_legal_tenant_idx` (`tenant_id`),
  INDEX `company_legal_vat_idx` (`vat_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. ZATCA Credentials (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_credentials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `environment` enum('sandbox','production') DEFAULT 'sandbox' NOT NULL,
  `vat_number` varchar(15) NOT NULL,
  `organization_identifier` varchar(255),
  `egs_serial_number` varchar(255),
  `device_uuid` varchar(100),
  `otp_encrypted` text,
  `csr_encrypted` text,
  `certificate_encrypted` text,
  `private_key_encrypted` text,
  `public_key_encrypted` text,
  `compliance_csid_encrypted` text,
  `production_csid_encrypted` text,
  `access_token_encrypted` text,
  `secret_token_encrypted` text,
  `is_active` boolean DEFAULT true,
  `last_test_at` timestamp NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_credentials_tenant_idx` (`tenant_id`),
  INDEX `zatca_credentials_env_idx` (`tenant_id`, `environment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ZATCA Certificates (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_certificates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `credential_id` bigint unsigned,
  `certificate_type` enum('ccsid','pcsid','csr','public_key','private_key') NOT NULL,
  `environment` enum('sandbox','production') DEFAULT 'sandbox' NOT NULL,
  `serial_number` varchar(255),
  `certificate_hash` varchar(255),
  `encrypted_payload` text NOT NULL,
  `issued_at` timestamp NULL,
  `expires_at` timestamp NULL,
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_cert_tenant_idx` (`tenant_id`),
  INDEX `zatca_cert_expiry_idx` (`tenant_id`, `expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ZATCA API Logs (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_api_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned,
  `action` enum('generate_xml','generate_qr','sign_invoice','compliance_check','clearance','reporting','sync_status','download_response') NOT NULL,
  `environment` enum('sandbox','production') DEFAULT 'sandbox' NOT NULL,
  `endpoint` varchar(500),
  `request_payload` json,
  `response_payload` json,
  `http_status` int,
  `status` enum('success','pending','failed') DEFAULT 'pending' NOT NULL,
  `error_code` varchar(100),
  `error_message` text,
  `ip_address` varchar(100),
  `user_agent` text,
  `user_id` bigint unsigned,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_api_logs_tenant_idx` (`tenant_id`),
  INDEX `zatca_api_logs_invoice_idx` (`tenant_id`, `invoice_id`),
  INDEX `zatca_api_logs_action_idx` (`tenant_id`, `action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. ZATCA Invoice Status (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_invoice_status` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned NOT NULL,
  `invoice_uuid` varchar(100),
  `invoice_counter` int DEFAULT 0 NOT NULL,
  `invoice_hash` varchar(255),
  `previous_invoice_hash` varchar(255),
  `digital_signature` text,
  `status` enum('draft','signed','pending','submitted','cleared','reported','rejected','failed') DEFAULT 'draft' NOT NULL,
  `clearance_status` varchar(100),
  `reporting_status` varchar(100),
  `zatca_request_id` varchar(255),
  `zatca_response_id` varchar(255),
  `error_code` varchar(100),
  `error_message` text,
  `warnings` json,
  `submitted_at` timestamp NULL,
  `cleared_at` timestamp NULL,
  `reported_at` timestamp NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `zatca_invoice_status_invoice_uidx` (`tenant_id`, `invoice_id`),
  INDEX `zatca_invoice_status_status_idx` (`tenant_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. ZATCA QR Codes (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_qr_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned NOT NULL,
  `tlv_base64` text NOT NULL,
  `qr_image_data_url` text,
  `tags` json,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_qr_tenant_invoice_idx` (`tenant_id`, `invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. ZATCA XML Documents (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_xml_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `invoice_id` bigint unsigned NOT NULL,
  `document_type` enum('standard','simplified','credit_note','debit_note') DEFAULT 'standard' NOT NULL,
  `unsigned_xml` text,
  `signed_xml` text,
  `cleared_xml` text,
  `xml_hash` varchar(255),
  `is_archived` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_xml_tenant_invoice_idx` (`tenant_id`, `invoice_id`),
  INDEX `zatca_xml_hash_idx` (`xml_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. ZATCA Activity Logs (if missing)
-- ============================================
CREATE TABLE IF NOT EXISTS `zatca_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned,
  `invoice_id` bigint unsigned,
  `action` varchar(100) NOT NULL,
  `message` text,
  `metadata` json,
  `ip_address` varchar(100),
  `user_agent` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `zatca_activity_tenant_idx` (`tenant_id`),
  INDEX `zatca_activity_invoice_idx` (`tenant_id`, `invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. Add ZATCA columns to invoices (if missing)
-- ============================================
ALTER TABLE `invoices`
  ADD COLUMN IF NOT EXISTS `zatca_qr_code` text AFTER `payment_method`,
  ADD COLUMN IF NOT EXISTS `zatca_xml` text AFTER `zatca_qr_code`,
  ADD COLUMN IF NOT EXISTS `zatca_status` enum('pending','reported','cleared') DEFAULT NULL AFTER `zatca_xml`;

-- ============================================
-- 10. Add ZATCA columns to company_settings (if missing)
-- ============================================
ALTER TABLE `company_settings`
  ADD COLUMN IF NOT EXISTS `zatca_enabled` boolean DEFAULT false AFTER `logo`,
  ADD COLUMN IF NOT EXISTS `zatca_sandbox` boolean DEFAULT true AFTER `zatca_enabled`;
