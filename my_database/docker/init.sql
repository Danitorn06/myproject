CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) CHECK (role IN ('student', 'university_student', 'university_staff', 'external', 'admin', 'fitness_staff')),
    qr_code_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Packages (
    package_id SERIAL PRIMARY KEY,
    user_type VARCHAR(30) CHECK (user_type IN ('student', 'university_staff', 'external')),
    duration VARCHAR(20) CHECK (duration IN ('one-time', 'monthly', '4-month')),
    price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE Memberships (
    membership_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    package_id INTEGER REFERENCES Packages(package_id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE FitnessClasses (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    class_type VARCHAR(30) CHECK (class_type IN ('Cardio', 'Strength', 'Flexibility')),
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

BEGIN;

INSERT INTO users (username, full_name, email, phone, password_hash, role)
VALUES 
('admin', 'System Admin', 'admin@example.com', '0800000000', 'hashedpassword', 'admin');

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    '4 เทคนิค ช่วยนอนหลับอย่างมีคุณภาพ',
    'การนอนที่ไม่ได้คุณภาพอาจส่งผลเสียต่อสุขภาพในระยะยาว แล้วเราควรจะนอนอย่างไรเพื่อให้ร่างกายได้พักผ่อนได้เต็มที่ วันนี้ขอนำเสนอ\n
4 เทคนิค ช่วยนอนหลับอย่างมีคุณภาพ\n
เทคนิคที่ 1 นอนให้เป็นเวลา เวลาที่เหมาะที่สุดคือช่วง 22:00 น. เพราะร่างกายจะหลั่งโกรทฮอร์โมน (Growth Hormone) ออกมามากที่สุดในช่วง 23:00 – 02:00 น.\n
เทคนิคที่ 2 บอกลาคาเฟอีนหลังสี่โมงเย็น คาเฟอีนหากดื่มช่วงเย็นจะทำให้นอนไม่หลับ\n
เทคนิคที่ 3 งีบอย่างมีคุณภาพ ประมาณ 20-30 นาที\n
เทคนิคที่ 4 วางมือถือ และปิดหน้าจอ 30 นาทีก่อนนอน\n
ศูนย์ออกกำลังกายคณะศึกษาศาสตร์ ม.ศิลปากร อาคารโสมสวลี ชั้น2 โทร. 034-241240',
    'https://example.com/images/yoga_class.jpg',
    'health',
    '2025-08-06',
    1
);

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    'ตลอดเดือน กรกฏาคม 2568 นี้ พบกับ Partner Workout Class',
    'ตลอดเดือน กรกฏาคม 2568 นี้ พบกับ Partner Workout Class คลาสออกกำลังกายแบบเป็นคู่ HIIT สลับพัก\n
วันพุธที่ 9 กรกฎาคม 2568 เวลา 18.30 น.\n
วันจันทร์ที่ 14 กรกฎาคม 2568 เวลา 18.30 น.\n
วันพฤหัสบดีที่ 31 กรกฎาคม 2568 เวลา 19.15 น.\n
มาออกกำลังกายกันเยอะๆนะครับ',
    'https://example.com/images/promotion_july.jpg',
    'general',
    '2025-08-07',
    1
);

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    '11-12 สิงหาคม 2568',
    '⛔️หยุดให้บริการ⛔️\n
📅11-12 สิงหาคม 2568\n
เนื่องในวันเฉลิมพระชนมพรรษา และวันแม่แห่งชาติ\n
ขออภัยในความไม่สะดวก ขอบคุณครับ\n
ศูนย์ออกกำลังกายคณะศึกษาศาสตร์ ม.ศิลปากร อาคารโสมสวลี ชั้น2 โทร. 034-241240',
    NULL,
    'general',
    '2025-08-08',
    1
);

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    '4 เทคนิค ช่วยนอนหลับอย่างมีคุณภาพ',
    'การนอนที่ไม่ได้คุณภาพอาจส่งผลเสียต่อสุขภาพในระยะยาว  แล้วเราควรจะนอนอย่างไรเพื่อให้ร่างกายได้พักผ่อนได้เต็มที่ วันนี้ขอนำเสนอ\n
"4 เทคนิค ช่วยนอนหลับอย่างมีคุณภาพ"\n
เทคนิคที่ 1 นอนให้เป็นเวลา\n
เวลาที่เหมาะที่สุดคือช่วง 22:00 น. เพราะร่างกายของเราจะหลั่งโกรทฮอร์โมน (Growth Hormone) ออกมามากที่สุดในช่วง 23:00 – 02:00 น. ซึ่งฮอร์โมนนี้มีส่วนช่วยเสริมภูมิต้านทานและบำรุงผิวพรรณให้เปล่งปลั่ง\n
เทคนิคที่ 2 บอกลาคาเฟอีนหลังสี่โมงเย็น\n
คาเฟอีนและน้ำตาลในเครื่องดื่มอาจช่วยให้เรากระปรี้กระเปร่าระหว่างการทำงาน แต่หากบริโภคในช่วงเย็นหรือหัวค่ำอาจกลายเป็นตาค้างจนรบกวนการพักผ่อน\n
เทคนิคที่ 3 งีบอย่างมีคุณภาพ\n
การงีบระหว่างวันอาจช่วยรีเฟรชร่างกายตอนกลางวันได้ แต่การงีบนานเกินไปหรืองีบช่วงเย็นถึงหัวค่ำอาจส่งผลต่อการนอนในตอนกลางคืนได้ ระยะเวลาที่เหมาะสมที่สุดคือประมาณ 20-30 นาที\n
เทคนิคที่ 4 วางมือถือ\n
เวลาที่สายตาของเราไม่ได้รับแสง สมองจะหลั่งสารเมลาโทนิน (Melatonin) ซึ่งทำให้รู้สึกง่วง แต่แสงจากหน้าจอหรือแสงจากถนนอาจไปรบกวนการหลั่งของสารดังกล่าวจนเรานอนไม่หลับ ดังนั้นควรจะละสายตาจากหน้าจอสัก 30 นาทีก่อนเข้านอน และจัดสภาพแวดล้อมในห้องนอนให้เหมาะสม\n
ศูนย์ออกกำลังกายคณะศึกษาศาสตร์ ม.ศิลปากร\n
อาคารโสมสวลี ชั้น2 คณะศึกษาศาสตร์\n
โทร. 034-241240',
    'https://example.com/images/sleep_tips.jpg',
    'health',
    '2025-08-06',
    1
);

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    '📌ประกาศ!! อัตราค่าบริการศูนย์ออกกำลังกายคณะศึกษาศาสตร์',
    '📌ประกาศ!!\n💵อัตราค่าบริการศูนย์ออกกำลังกายคณะศึกษาศาสตร์\n📆ตั้งแต่ 4 สิงหาคม 2568 เป็นต้นไป\n.\n🟩ประเภทที่ 1 :\nนักศึกษามหาวิทยาลัยศิลปากร\nนักเรียนโรงเรียนสาธิตแห่งมหาวิทยาลัยศิลปากร\nบุคลากรมหาวิทยาลัยศิลปากร\n500 บาท/เดือน \n50 บาท/ครั้ง\n.\n🟦ประเภทที่ 2 :\nบุคคลภายนอก\n1,000 บาท/เดือน \n100 บาท/ครั้ง\n-----------------------\nศูนย์ออกกำลังกายคณะศึกษาศาสตร์ ม.ศิลปากร\nอาคารโสมสวลี ชั้น2 คณะศึกษาศาสตร์\nโทร. 034-241240',
    'https://example.com/images/announcement_fees.jpg',
    'general',
    '2025-08-04',
    1
);

INSERT INTO news (
    title, content, image_url, type, publish_date, created_by
) VALUES (
    'กินโปรตีนเยอะ กล้ามเนื้อขึ้น?',
    'โปรตีน (Protein) สารอาหารหลักในการสร้างกล้ามเนื้อ\n
การทานโปรตีนเยอะๆ สามารถช่วยให้กล้ามเนื้อเพิ่มขึ้นได้ แต่ต้องมีการออกกำลังกายควบคู่ไปด้วย การทานโปรตีนเพียงอย่างเดียว มากเกินความต้องการของร่างกาย จะถูกนำไปใช้เป็นพลังงานหรือเก็บเป็นไขมันแทน\n
สูตรคำนวณโปรตีนอย่างง่าย\n
น้ำหนักตัว x ค่าความต้องการโปรตีน = ปริมาณโปรตีนที่ควรได้รับต่อวัน (กรัม)\n
ค่าความต้องการโปรตีน\n
* ไม่ได้ออกกำลังกาย 0.8-1.0 กรัม / กิโลกรัม\n
* ออกกำลังกายเบาๆ / เดินเล่น 1.0-1.2 กรัม / กิโลกรัม\n
* ออกกำลังกายสม่ำเสมอ / คาร์ดิโอ 1.2-1.6 กรัม / กิโลกรัม\n
* เวทเทรนนิ่ง / สร้างกล้ามเนื้อ 1.6-2.2 กรัม / กิโลกรัม\n
* นักกีฬา / ฝึกหนักมากๆ 2.0-2.5 กรัม / กิโลกรัม\n\n
โภชนาการอื่นๆที่เสริมสร้างกล้ามเนื้อ\n
คาร์โบไฮเดรต (Carbohydrate) แหล่งพลังงานสำคัญที่สนับสนุนการฝึก\n
บทบาทหลัก\n
* คาร์โบไฮเดรตเปลี่ยนเป็น กลูโคส แล้วสะสมเป็น ไกลโคเจน ในกล้ามเนื้อและตับ ซึ่งเป็นแหล่งพลังงานหลักสำหรับการฝึกเวท\n
* การฝึกที่เข้มข้น (เช่น hypertrophy training) ต้องใช้พลังงานจากไกลโคเจนมาก\n
* ถ้าคาร์บไม่พอ ร่างกายอาจดึงโปรตีนมาใช้เป็นพลังงานแทน ซึ่งจะลดโอกาสสร้างกล้ามเนื้อ\n
เสริมการฟื้นตัว\n
* หลังฝึก เวลาที่ร่างกายได้รับคาร์โบไฮเดรต มันจะช่วยกระตุ้น insulin ซึ่งช่วยส่งกรดอะมิโนเข้าสู่กล้ามเนื้อ ทำให้ MPS มีประสิทธิภาพยิ่งขึ้น\n
คำแนะนำ\n
* ควรบริโภคคาร์โบไฮเดรตเชิงซ้อน เช่น ข้าวกล้อง มันฝรั่ง ขนมปังโฮลวีต โดยเฉพาะก่อนและหลังการฝึก\n\n
ไขมัน (Fat) ฮอร์โมนและสุขภาพโดยรวมที่เกี่ยวข้องกับการสร้างกล้าม\n
บทบาทหลัก\n
* ไขมันช่วยในการผลิตฮอร์โมนที่สำคัญต่อการสร้างกล้ามเนื้อ เช่น เทสโทสเตอโรน (Testosterone)\n
* ให้พลังงานระยะยาว โดยเฉพาะในช่วงที่ไม่ฝึก\n
* ช่วยในการดูดซึมวิตามินที่ละลายในไขมัน เช่น วิตามิน A, D, E, K ซึ่งมีส่วนช่วยในการฟื้นตัวและภูมิคุ้มกัน\n
คำแนะนำ\n
* เน้นไขมันดีจากแหล่งเช่น น้ำมันมะกอก อะโวคาโด ถั่ว ไข่แดง ปลาแซลมอน\n
* ไม่ควรลดไขมันมากเกินไป เพราะอาจกระทบฮอร์โมนและระบบเผาผลาญ\n\n
แหล่งอ้างอิง\n
- Testosterone and cortisol in relationship to dietary nutrients and resistance exercise\n
- International society of sports nutrition position stand: nutrient timing\n
- A brief review of critical processes in exercise-induced muscular hypertrophy\n\n
จัดทำโดย นักศึกษาฝึกประสบการณ์วิชาชีพวิทยาศาสตร์การกีฬา กลุ่มที่ 5\n
ศูนย์ออกกำลังกายคณะศึกษาศาสตร์ ม.ศิลปากร\n
อาคารโสมสวลี ชั้น 2 คณะศึกษาศาสตร์\n
โทร. 034-241240',
    'https://example.com/images/protein_muscle.jpg',
    'health',
    '2025-08-25',
    1
);

-- Monday
INSERT INTO fitnessclasses (name, description, class_type, time, day_of_week, created_by)
VALUES 
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '07:00', 'Monday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '17:00', 'Monday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '17:45', 'Monday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '18:00', 'Monday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '19:15', 'Monday', 1);

-- Tuesday
INSERT INTO fitnessclasses (name, description, class_type, time, day_of_week, created_by)
VALUES 
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '07:00', 'Tuesday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '17:00', 'Tuesday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '17:45', 'Tuesday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '18:00', 'Tuesday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '19:15', 'Tuesday', 1);

-- Wednesday
INSERT INTO fitnessclasses (name, description, class_type, time, day_of_week, created_by)
VALUES 
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '07:00', 'Wednesday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '17:00', 'Wednesday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '17:45', 'Wednesday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '18:00', 'Wednesday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '19:15', 'Wednesday', 1);

-- Thursday
INSERT INTO fitnessclasses (name, description, class_type, time, day_of_week, created_by)
VALUES 
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '07:00', 'Thursday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '17:00', 'Thursday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '17:45', 'Thursday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '18:00', 'Thursday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '19:15', 'Thursday', 1);

-- Friday
INSERT INTO fitnessclasses (name, description, class_type, time, day_of_week, created_by)
VALUES 
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '07:00', 'Friday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '17:00', 'Friday', 1),
('เวทเทรนนิ่ง', 'ชั้นเรียนเวทเทรนนิ่ง', 'Strength', '17:45', 'Friday', 1),
('คาร์ดิโอ', 'ชั้นเรียนคาร์ดิโอ', 'Cardio', '18:00', 'Friday', 1),
('โยคะ', 'ชั้นเรียนโยคะ', 'Flexibility', '19:15', 'Friday', 1);

INSERT INTO Packages (user_type, duration, price) VALUES
('student', 'monthly', 500),
('student', '4-month', 1500),
('university_staff', 'monthly', 500),
('university_staff', '4-month', 1800),
('external', 'monthly', 1000),
('external', '4-month', 3000)

COMMIT;

