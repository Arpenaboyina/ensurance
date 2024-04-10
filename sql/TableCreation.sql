create database DBMS;

use DBMS;

CREATE TABLE if not exists `customer`(
    cust_id varchar(20) primary key,
    cust_fname VARCHAR(10) NOT NULL,
    cust_lname VARCHAR(10) NOT NULL,
    cust_DOB DATE NOT NULL,
    cust_gender CHAR(2) NOT NULL,
    cust_mob_number decimal(10,0) NOT NULL,
    cust_email VARCHAR(225) NOT NULL,
    cust_passport_number VARCHAR(20) NOT NULL,
    cust_martial_status CHAR(10) NOT NULL,
    cust_ppS_number char(9) NOT NULL
);

CREATE TABLE IF NOT EXISTS `Application`(
    application_id VARCHAR(20) primary key,
    cust_id VARCHAR(20) NOT NULL,
    vehicle_id VARCHAR(20) NOT NULL,
    application_status ENUM("accepted","rejected","pending") DEFAULT 'pending',
    coverage VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `quote`(
    quote_id VARCHAR(20) primary key NOT NULL,
    application_id VARCHAR(20)  NOT NULL,
    cust_id varchar(20)  NOT NULL,
    issue_date DATETIME  NOT NULL,
    valid_from_date DATETIME NOT NULL,
    valid_till_date DATETIME NOT NULL,
    description VARCHAR(100) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    coverage_level VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS `insurance_policy`(
    aggrement_id VARCHAR(20) primary key,
    application_id VARCHAR(20) NOT NULL,
    cust_id varchar(20) NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    policy_number VARCHAR(20) NOT NULL,
    start_date DATETIME NOT NULL,
    expiry_date DATETIME NOT NULL,
    term_condition_description VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS `premium_payment`(
    premium_payment_id VARCHAR(20) primary key,
    cust_id VARCHAR(20) NOT NULL,
    policy_number VARCHAR(20) NOT NULL,
    premium_payment_schedule DATETIME NOT NULL,
    premium_payment_amount INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS `vehicle`(
    vehicle_id	VARCHAR(20) primary key,
    cust_id	VARCHAR(20) NOT NULL,
    policy_id	VARCHAR(20) NOT NULL,
    dependent_nok_id	VARCHAR(20) NOT NULL,
    vehicle_registration_number	VARCHAR(20) NOT NULL,
    vehicle_value INTEGER,
    vehicle_type VARCHAR(20) NOT NULL,
    vehicle_size INTEGER,
    vehicle_number_of_seat INTEGER,
    vehicle_manufacturer VARCHAR(20) NOT NULL,
    vehicle_chasis_number varchar(30) NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    vehicle_model_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS `claim`(
    claim_id	    VARCHAR(20) primary key,
    cust_id	        VARCHAR(20) NOT NULL,
    agreement_id	VARCHAR(20) NOT NULL,
    claim_amount	INTEGER NOT NULL,
    incident_id	    VARCHAR(20) ,
    damage_type	    VARCHAR(20),
    date_of_claim	DATE NOT NULL,
    claim_status	ENUM("accepted","rejected","pending") DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS `claim_settlement`(
    claim_settlement_id VARCHAR(20) primary key,
    claim_id VARCHAR(20) NOT NULL,
    cust_id VARCHAR(20) NOT NULL,
    vehicle_id VARCHAR(20) NOT NULL,
    date_settled DATE,
    amount_paid INTEGER NOT NULL,
    coverage_id VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS `staff`(
    staff_id VARCHAR(20) primary key,
    company_name VARCHAR(40) NOT NULL,
    staff_fname VARCHAR(10) NOT NULL,
    staff_lname VARCHAR(10) NOT NULL,
    staff_address VARCHAR(20) NOT NULL,
    staff_contact DECIMAL(10,0) NOT NULL,
    staff_gender CHAR(2),
    staff_marital_status CHAR(8),
    staff_nationality CHAR(15),
    staff_qualification VARCHAR(20),
    staff_allowance INTEGER,
    staff_pps_number INTEGER
);
CREATE TABLE IF NOT EXISTS `department`(
    department_name	 VARCHAR(50) primary key,
    company_name VARCHAR(40) NOT NULL,
    contact_information	VARCHAR(20) NOT NULL,
    department_staff VARCHAR(50),
    department_leader VARCHAR(30) NOT NULL
);
CREATE TABLE IF NOT EXISTS `office`(
    office_name VARCHAR(20) primary key NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    company_name VARCHAR(40) NOT NULL,
    office_leader VARCHAR(20) NOT NULL,
    contact_information VARCHAR(20) NOT NULL,
    address VARCHAR(20),
    admin_cost INTEGER,
    staff VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS `membership`(
    membership_id VARCHAR(20) primary key,
    cust_id	VARCHAR(20) NOT NULL,
    membership_type	CHAR(15),
    organisation_contact VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS `vehicle_service`(
    vehicle_service	VARCHAR(20) primary key,
    vehicle_id	VARCHAR(20) NOT NULL,
    cust_id	VARCHAR(20) NOT NULL,
    department_name	CHAR(20) NOT NULL,
    vehicle_service_address	VARCHAR(20),
    vehicle_service_contact	VARCHAR(20),
    vehicle_service_incharge CHAR(20),
    vehicle_service_type VARCHAR(20)
);
CREATE TABLE IF NOT EXISTS `NOK`(
    nok_id	VARCHAR(20) primary key,
    agreement_id VARCHAR(20) NOT NULL,
    application_id VARCHAR(20) NOT NULL,
    cust_id	VARCHAR(20) NOT NULL,
    nok_name VARCHAR(20) NOT NULL,
    nok_address	VARCHAR(20),
    nok_phone_number INTEGER NOT NULL,
    nok_marital_status ENUM("married","unmarried"),
    nok_gender ENUM("m","f","o") NOT NULL
);
CREATE TABLE IF NOT EXISTS `insurance_companies`(
    company_name	VARCHAR(40) primary key,
    company_address	VARCHAR(20) NOT NULL,
    company_contact_number	decimal(10,0) NOT NULL,
    company_fax	decimal(10,0) NOT NULL,
    company_email VARCHAR(20) NOT NULL,
    company_website VARCHAR(20),
    company_location VARCHAR(20),
    company_department_name VARCHAR(20),
    company_office_name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS `POLICY_RENEWABLE`(
    policy_renewable_id	VARCHAR(20) primary key,
	agreement_id VARCHAR(100) NOT NULL,
    application_id VARCHAR(20) NOT NULL,
    cust_id	 VARCHAR(20) NOT NULL,
    date_of_renewal	DATE,
    type_of_renewal	 CHAR(15)
);

CREATE TABLE IF NOT EXISTS `incident`(
    INCIDENT_ID	VARCHAR(20) primary key,
    INCIDENT_TYPE VARCHAR(30) NOT NULL,
    INCIDENT_DATE DATE,
    `DESCRIPTION` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `incident_report`(
    incident_report_id	VARCHAR(20) primary key,
    incident_id	VARCHAR(20) NOT NULL,
    cust_id	VARCHAR(20),
    incident_inspector	VARCHAR(20),
    incident_cost	INTEGER,
    incident_type	CHAR(30),
    incident_report_description	VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `coverage`(
    coverage_id	VARCHAR(20) primary key,
    company_name	VARCHAR(40),
    coverage_amount	INTEGER,
    coverage_type	CHAR(50),
    coverage_level	CHAR(15),
    product_id	VARCHAR(20) NULL,
    coverage_description VARCHAR(2000),
    coverage_terms	VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS `product`(
    product_number	VARCHAR(20) primary key,
    company_name	VARCHAR(40) NOT NULL,
    product_price	INTEGER,
    product_type	CHAR(15)
);

CREATE TABLE IF NOT EXISTS `receipt`(
    receipt_id	 VARCHAR(20) primary key,
    premium_payment_id	 VARCHAR(20),
    cust_id	 VARCHAR(20) NOT NULL,
    cost INTEGER,
    time DATE
);

CREATE TABLE IF NOT EXISTS `insurance_policy_coverage`(
    agreement_id VARCHAR(20) primary key,	
    coverage_id	 VARCHAR(20) NOT NULL
);
    
show tables;
describe customer;
describe application;
describe quote;
describe insurance_policy;
describe premium_payment;
describe vehicle;
describe claim;
describe claim_settlement;
describe staff;
describe department;
describe office;
describe membership;
describe vehicle_service;
describe nok;
describe insurance_companies;
describe policy_renewable;
describe incident;
describe incident_report;
describe coverage;
describe product;
describe receipt;
describe insurance_Policy_coverage;