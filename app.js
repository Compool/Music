// Mock Data (Based on schema.sql)
const mockUsers = [
    { user_id: 1, username: 'kpop_fan_99', profile_img_url: 'https://i.pravatar.cc/150?img=11' },
    { user_id: 2, username: 'indie_lover', profile_img_url: 'https://i.pravatar.cc/150?img=12' },
    { user_id: 3, username: 'music_explorer', profile_img_url: 'https://i.pravatar.cc/150?img=13' },
    { user_id: 4, username: 'night_driver', profile_img_url: 'https://i.pravatar.cc/150?img=14' }
];

const mockPosts = [
    {
        post_id: 1,
        user_id: 1,
        song_title: 'Supernova',
        artist_name: 'aespa',
        genre: '아이돌',
        album_art_url: 'https://images.unsplash.com/photo-1621252179027-9c4c23ba78fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '쇠맛 나는 비트와 폭발적인 보컬! 드라이브할 때 들으면 텐션이 바로 올라갑니다. 강력 추천해요🔥',
        likes: 124,
        comments: 12
    },
    {
        post_id: 2,
        user_id: 2,
        song_title: '파도의 끝에서',
        artist_name: '검정치마',
        genre: '인디',
        album_art_url: 'https://images.unsplash.com/photo-1459506404983-34674404fc7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '새벽에 혼자 맥주 마시면서 듣기 좋은 곡입니다. 특유의 잔잔하고 우울한 감성이 매력적이에요.',
        likes: 89,
        comments: 5
    },
    {
        post_id: 3,
        user_id: 3,
        song_title: 'Love wins all',
        artist_name: '아이유 (IU)',
        genre: '발라드',
        album_art_url: 'https://images.unsplash.com/photo-1493225457124-a1a2a5df378b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '따뜻한 위로가 되는 가사와 목소리. 눈감고 들으면 영화 속 한 장면이 떠오르는 환상적인 곡입니다.',
        likes: 256,
        comments: 45
    },
    {
        post_id: 4,
        user_id: 4,
        song_title: 'Hype Boy',
        artist_name: 'NewJeans',
        genre: '아이돌',
        album_art_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '청량감의 끝판왕! 언제 들어도 기분이 좋아지는 마법 같은 노래. 무조건 필수!!',
        likes: 312,
        comments: 67
    },
    {
        post_id: 5,
        user_id: 2,
        song_title: 'To Die For',
        artist_name: 'Sam Smith',
        genre: '발라드',
        album_art_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '쓸쓸한 감성이 돋보이는 팝송. 가사가 너무 아름다워서 계속 반복해서 듣게 됩니다.',
        likes: 198,
        comments: 24
    },
    {
        post_id: 6,
        user_id: 3,
        song_title: 'Ditto',
        artist_name: 'NewJeans',
        genre: '아이돌',
        album_art_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        recommendation_reason: '겨울 감성에 이보다 더 잘 어울리는 곡이 있을까요? 아련하고 따뜻한 느낌이 최고입니다.',
        likes: 450,
        comments: 102
    }
];

// State
let currentFilter = '전체';
let stateLikes = {}; // Format: { post_id: boolean }

// DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initLikesState();
    renderFeed();
    setupFilters();
    setupModalClose();
});

function initLikesState() {
    mockPosts.forEach(post => {
        stateLikes[post.post_id] = false;
    });
}

function getUser(userId) {
    return mockUsers.find(u => u.user_id === userId);
}

function renderFeed() {
    const feedContainer = document.getElementById('music-feed');
    feedContainer.innerHTML = '';

    const filteredPosts = currentFilter === '전체' 
        ? mockPosts 
        : mockPosts.filter(p => p.genre === currentFilter);

    if (filteredPosts.length === 0) {
        feedContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">해당 카테고리의 게시글이 없습니다.</p>';
        return;
    }

    filteredPosts.forEach(post => {
        const user = getUser(post.user_id);
        const isLiked = stateLikes[post.post_id];
        const likeCount = post.likes + (isLiked ? 1 : 0);

        const card = document.createElement('div');
        card.className = 'post-card';
        card.innerHTML = `
            <div class="post-header">
                <img src="${user.profile_img_url}" alt="${user.username}" class="avatar">
                <span class="post-author">${user.username}</span>
                <span style="margin-left:auto; font-size: 0.8rem; color: var(--text-secondary);">${post.genre}</span>
            </div>
            <div class="album-art-container">
                <img src="${post.album_art_url}" alt="${post.song_title} Album Art" class="album-art" loading="lazy">
                <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <h3 class="song-title">${post.song_title}</h3>
            <p class="artist-name">${post.artist_name}</p>
            <p class="reason-text">"${post.recommendation_reason}"</p>
            <div class="post-actions" onclick="event.stopPropagation()">
                <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.post_id})">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                    <span>${likeCount}</span>
                </button>
                <button class="action-btn" onclick="openModal(${post.post_id})">
                    <i class="far fa-comment-alt"></i>
                    <span>${post.comments}</span>
                </button>
                <button class="action-btn">
                    <i class="fas fa-share-nodes"></i>
                </button>
            </div>
        `;
        // clicking the card opens the modal
        card.onclick = () => openModal(post.post_id);
        feedContainer.appendChild(card);
    });
}

window.toggleLike = function(postId) {
    stateLikes[postId] = !stateLikes[postId];
    renderFeed(); // Re-render to update UI immediately
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentFilter = e.target.textContent;
            renderFeed();
        });
    });
}

// Modal Logic
const modal = document.getElementById('post-modal');
const modalBody = document.getElementById('modal-body');

window.openModal = function(postId) {
    const post = mockPosts.find(p => p.post_id === postId);
    const user = getUser(post.user_id);
    const isLiked = stateLikes[postId];
    const likeCount = post.likes + (isLiked ? 1 : 0);
    
    modalBody.innerHTML = `
        <div style="display:flex; gap: 3rem; flex-wrap: wrap; align-items: flex-start;">
            <div style="flex: 1; min-width: 300px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <img src="${post.album_art_url}" style="width:100%; height:auto; display: block;" alt="Album Cover">
            </div>
            <div style="flex: 1.5; min-width: 300px; display: flex; flex-direction: column;">
                <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem;">
                    <img src="${user.profile_img_url}" class="avatar" style="width: 45px; height: 45px;">
                    <div>
                        <div style="font-weight:700; font-size: 1.1rem;">${user.username}</div>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">${post.genre} 추천</div>
                    </div>
                </div>
                <h2 style="font-size:3rem; font-weight: 800; margin-bottom: 0.5rem; line-height:1.1; letter-spacing: -1px;">${post.song_title}</h2>
                <h3 style="font-size:1.5rem; color: var(--text-secondary); margin-bottom: 2rem;">${post.artist_name}</h3>
                
                <div style="background: rgba(255,255,255,0.05); padding: 1.8rem; border-radius: 16px; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="font-size: 1.15rem; line-height: 1.7; color: #e2e8f0;">"${post.recommendation_reason}"</p>
                </div>
                
                <div style="display:flex; gap: 1rem; margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                    <button class="primary-btn" style="flex:1; justify-content:center; border-radius: 12px; padding: 1.2rem;">
                        <i class="fas fa-play"></i> 음악 재생하기
                    </button>
                    <button class="action-btn ${isLiked ? 'liked' : ''}" style="font-size:1.3rem; background:rgba(255,255,255,0.08); padding: 0 2rem; border-radius: 12px; height: 100%;" onclick="toggleLike(${post.post_id}); setTimeout(() => openModal(${post.post_id}), 50)">
                        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i> <span style="font-weight:600; font-size:1.1rem; margin-left:8px;">${likeCount}</span>
                    </button>
                    <button class="action-btn" style="font-size:1.3rem; background:rgba(255,255,255,0.08); padding: 0 1.5rem; border-radius: 12px; height: 100%;">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                
                <div style="margin-top: 3rem;">
                    <h4 style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 1.1rem;">댓글 (${post.comments})</h4>
                    <div style="display:flex; gap: 1rem; align-items: stretch;">
                        <input type="text" placeholder="댓글을 남겨보세요..." style="flex:1; padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color:white; font-size: 1rem; outline:none; font-family: 'Pretendard', sans-serif;">
                        <button class="primary-btn" style="padding: 0 2rem; border-radius: 12px;">게시</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function setupModalClose() {
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.onclick = () => closeModal();
    
    // Close on outside click
    window.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    }
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore background scrolling
}
