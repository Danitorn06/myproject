CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) CHECK (role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
    qr_code_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PACKAGES
-- =========================
CREATE TABLE packages (
    package_id SERIAL PRIMARY KEY,
    user_type VARCHAR(30) CHECK (user_type IN ('student', 'university_staff', 'external')) NOT NULL,
    duration INT NOT NULL CHECK (duration >= 0),
    price NUMERIC(10,2) NOT NULL
);
-- =========================
-- MEMBERSHIPS
-- =========================
CREATE TABLE memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    membership_no VARCHAR(50) NOT NULL,
    package_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_membership_package
        FOREIGN KEY (package_id) REFERENCES packages(package_id),

    CONSTRAINT uq_user_membership_no
        UNIQUE (user_id, membership_no)
);
CREATE TABLE membership_info (
    info_id SERIAL PRIMARY KEY,

    membership_id INT NOT NULL UNIQUE,

    -- ข้อมูลทั่วไป
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male','female')),
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    line_id VARCHAR(100),

    -- ประเภทสมาชิกจากฟอร์ม
    user_type VARCHAR(30)
        CHECK (user_type IN ('student', 'university_staff', 'external')),

    faculty VARCHAR(100),
    major VARCHAR(100),
    student_id VARCHAR(50),

    department VARCHAR(100),

    -- ข้อมูลฉุกเฉิน
    emergency_name VARCHAR(100),
    emergency_phone VARCHAR(20),

    -- รู้จักจากไหน
    known_from VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_membership_info
        FOREIGN KEY (membership_id)
        REFERENCES memberships(membership_id)
        ON DELETE CASCADE
);
CREATE TABLE health_answers (
    health_id SERIAL PRIMARY KEY,

    membership_id INT NOT NULL UNIQUE,

    q1 BOOLEAN,
    q2 BOOLEAN,
    q3 BOOLEAN,
    q4 BOOLEAN,
    q5 BOOLEAN,
    q6 BOOLEAN,
    q7 BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_health_membership
        FOREIGN KEY (membership_id)
        REFERENCES memberships(membership_id)
        ON DELETE CASCADE
);

CREATE TABLE FitnessClasses (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    class_type VARCHAR(30) CHECK (class_type IN ('Cardio', 'Strength', 'Flexibility')),
    instructor VARCHAR(100),
    image_url TEXT,
    time TIME NOT NULL,
    day_of_week VARCHAR(20) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    created_by INTEGER REFERENCES Users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE News (
    news_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    type VARCHAR(20) CHECK (type IN ('general', 'health')),
    publish_date DATE NOT NULL,
    created_by INTEGER REFERENCES Users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LoginSessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,
    ip_address INET
);

CREATE TABLE ScanLogs (
    scan_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id),
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT,
    role VARCHAR(20),
    action VARCHAR(50),
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
type FitnessVisit struct {
	ID           uint      `gorm:"primaryKey"`
	MembershipID uint      `gorm:"index" json:"membership_id"`
	VisitDate    time.Time `gorm:"not null" json:"visit_date"`
	CreatedAt    time.Time

	Membership Membership `gorm:"foreignKey:MembershipID;references:MembershipID"`
}

