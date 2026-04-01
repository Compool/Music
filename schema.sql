-- 1. 사용자 테이블
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_img_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 음악 게시글 테이블
CREATE TABLE Music_Posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    song_title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(50),
    album_art_url TEXT,
    recommendation_reason TEXT,
    music_link_url TEXT, -- 유튜브나 스포티파이 링크
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. 댓글 테이블
CREATE TABLE Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Music_Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. 좋아요 테이블 (중복 추천 방지)
CREATE TABLE Likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES Music_Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
