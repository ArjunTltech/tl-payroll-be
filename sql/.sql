CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,                  -- Auto-incrementing ID
    name NVARCHAR(100) NOT NULL,                        -- User's full name
    email NVARCHAR(100) UNIQUE NOT NULL,                -- Unique email address
    password NVARCHAR(255) NOT NULL,                    -- Hashed password
    role NVARCHAR(50) CHECK (role IN ('Admin', 'HR')) NOT NULL,  -- Role (only 'Admin' or 'HR')
    created_at DATETIME DEFAULT GETDATE(),              -- Timestamp of account creation
    refreshToken NVARCHAR(255) NULL                     -- Optional refresh token field
);
CREATE TABLE Employees (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    employee_id NVARCHAR(50) UNIQUE NOT NULL,
    dob DATE NULL,
    department NVARCHAR(100) NOT NULL,
    designation NVARCHAR(100) NOT NULL,
    status NVARCHAR(50) CHECK (status IN ('Active', 'Resigned')) NOT NULL,
    joining_date DATE NOT NULL,
    tenure AS DATEDIFF(MONTH, joining_date, GETDATE()),
    last_working_day DATE NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- BANK DETAILS TABLE
CREATE TABLE BankDetails (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL FOREIGN KEY REFERENCES Employees(id) ON DELETE CASCADE,
    bank_name NVARCHAR(100) NOT NULL,
    account_number NVARCHAR(50) NOT NULL,
    ifsc_code NVARCHAR(20) NOT NULL,
    account_type NVARCHAR(50) CHECK (account_type IN ('Savings', 'Current')) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- PAYROLL TABLE
CREATE TABLE Payroll (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL FOREIGN KEY REFERENCES Employees(id) ON DELETE CASCADE,
    pay_period NVARCHAR(50) NOT NULL, -- Example: "September 2024 - October 2024"
    pay_date DATE NOT NULL,
    salary_mode NVARCHAR(50) CHECK (salary_mode IN ('Bank Transfer', 'Cash', 'Check')) NOT NULL,
    salary_credit_method NVARCHAR(50) CHECK (salary_credit_method IN ('GPay', 'UPI', 'Bank Transfer')) NOT NULL,
    working_days INT NOT NULL,
    lop_days INT DEFAULT 0,
    paid_days AS (working_days - lop_days),
    basic_salary FLOAT NOT NULL,
    hra FLOAT NOT NULL,
    other_allowances FLOAT DEFAULT 0,
    income_tax FLOAT DEFAULT 0,
    provident_fund FLOAT DEFAULT 0,
    total_deductions AS (income_tax + provident_fund),
    gross_earnings AS (basic_salary + hra + other_allowances),
    net_pay AS (basic_salary + hra + other_allowances - (income_tax + provident_fund)),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- LEAVE SUMMARY TABLE
CREATE TABLE LeaveSummary (
    id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL FOREIGN KEY REFERENCES Employees(id) ON DELETE CASCADE,
    annual_leave_entitlement INT NOT NULL,
    casual_leave_taken INT DEFAULT 0,
    remaining_leaves AS (annual_leave_entitlement - casual_leave_taken),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Add soft delete to Employees table
ALTER TABLE Employees
ADD deleted_on DATETIME NULL;

-- Add soft delete to BankDetails table
ALTER TABLE BankDetails
ADD deleted_on DATETIME NULL;

-- Add soft delete to Payroll table
ALTER TABLE Payroll
ADD deleted_on DATETIME NULL;

-- Add soft delete to LeaveSummary table
ALTER TABLE LeaveSummary
ADD deleted_on DATETIME NULL;



CREATE TABLE Departments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE,        -- Department name (e.g., 'Development')
    created_at DATETIME DEFAULT GETDATE(),     -- Timestamp of record creation
    updated_at DATETIME DEFAULT GETDATE(),     -- Timestamp of record update
    deleted_on DATETIME NULL                   -- Timestamp for deletion (if soft delete is needed)
);


CREATE TABLE Designations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    department_id INT NOT NULL,                 -- Foreign key referring to Departments
    name NVARCHAR(100) NOT NULL UNIQUE,         -- Designation name (e.g., 'Full Stack Developer')
    created_at DATETIME DEFAULT GETDATE(),     -- Timestamp of record creation
    updated_at DATETIME DEFAULT GETDATE(),     -- Timestamp of record update
    deleted_on DATETIME NULL,                   -- Timestamp for deletion (if soft delete is needed)
    FOREIGN KEY (department_id) REFERENCES Departments(id) -- Foreign key constraint
);


ALTER TABLE Employees
ADD department_id INT NOT NULL,               -- Foreign key to Departments
    designation_id INT NOT NULL,              -- Foreign key to Designations
    FOREIGN KEY (department_id) REFERENCES Departments(id),  -- Linking to Departments
    FOREIGN KEY (designation_id) REFERENCES Designations(id); -- Linking to Designations

ALTER TABLE Employees
DROP COLUMN designation;
ALTER TABLE Employees
DROP COLUMN department;    


INSERT INTO Departments (name) VALUES
('Development'),
('Graphic Team'),
('HR'),
('Executive');

INSERT INTO Designations (department_id, name) VALUES
(1, 'Full Stack Developer'),
(1, 'Backend Developer'),
(1, 'Frontend Developer'),
(1, 'Flutter Developer');

-- Insert designations for the Graphic Team department
INSERT INTO Designations (department_id, name) VALUES
(2, 'Graphic Designer');

-- Insert designations for the HR department
INSERT INTO Designations (department_id, name) VALUES
(3, 'HR Manager'),
(3, 'HR Executive');

-- Insert designations for the Executive department
INSERT INTO Designations (department_id, name) VALUES
(4, 'CEO'),
(4, 'COO'),
(4, 'CFO'),
(4, 'CTO');



