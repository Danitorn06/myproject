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
    membership_no INT NOT NULL,
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


