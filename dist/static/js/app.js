async function fetchData(file) {
    const response = await fetch(`data/${file}`);
    return await response.json();
}

function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

async function doSearch(query) {
    if (!query) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    
    const cookies = await fetchData('cookies.json');
    const kpdh = await fetchData('kpdh.json');
    const news = await fetchData('news.json');
    const events = await fetchData('events.json');
    
    const results = { cookies: [], kpdh: [], news: [], events: [] };
    const q = query.toLowerCase();

    cookies.forEach(c => { if (q in c.name.toLowerCase()) results.cookies.push(c); });
    kpdh.forEach(k => { if (q in k.name.toLowerCase()) results.kpdh.push(k); });
    news.forEach(n => { if (q in n.title.toLowerCase()) results.news.push(n); });
    events.forEach(e => { if (q in e.name.toLowerCase()) results.events.push(e); });

    let html = '';
    const categories = { 'cookies': '🍪 Cookie', 'kpdh': '🎤 KPDH', 'news': '📰 News', 'events': '📅 Event' };

    for (const [key, items] of Object.entries(results)) {
        items.forEach(item => {
            const name = item.name || item.title;
            html += `
                <div class="search-item" onclick="location.href='/${key === 'cookies' ? 'cookies' : key === 'kpdh' ? 'kpdh' : key === 'news' ? 'news' : 'events'}.html'">
                    <span><strong>${categories[key]}</strong>: ${name}</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
            `;
        });
    }
    document.getElementById('search-results').innerHTML = html || '<div class="search-item">No results found</div>';
}

function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    const themes = ['dark', 'light', 'kpdh', 'cookie'];
    let current = html.getAttribute('data-theme');
    let next = themes[(themes.indexOf(current) + 1) % themes.length];
    
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    
    const themeIcons = { 'dark': 'fa-moon', 'light': 'fa-sun', 'kpdh': 'fa-bolt', 'cookie': 'fa-cookie' };
    icon.className = `fas ${themeIcons[next]}`;
}

function openModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-container').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}

function toggleFavorite(id) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favs.includes(id)) {
        favs = favs.filter(item => item !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    updateFavButtons();
}

function updateFavButtons() {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        btn.classList.toggle('active', favs.includes(id));
    });
}

async function renderCookies() {
    const cookies = await fetchData('cookies.json');
    const grid = document.getElementById('cookies-grid');
    if (!grid) return;
    
    grid.innerHTML = cookies.map((c, i) => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div class="char-img-placeholder" style="width: 60px; height: 60px; background: var(--accent-pink); border-radius: 50%; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">
                    ${c.name[0]}
                </div>
                <button class="fav-btn" data-id="cookie-${i}" onclick="toggleFavorite('cookie-${i}')">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <h3>${c.name}</h3>
            <p><strong>${c.rarity}</strong> | ${c.game}</p>
            <p style="color: var(--text-dim); font-size: 0.9rem;">${c.description}</p>
            <button class="btn btn-secondary" style="width: 100%;" onclick="openModal('<h3>${c.name}</h3><p>Rarity: ${c.rarity}</p><p>Game: ${c.game}</p><hr><p>${c.description}</p>')">
                Details
            </button>
        </div>
    `).join('');
    updateFavButtons();
}

async function renderKPDH() {
    const chars = await fetchData('kpdh.json');
    const grid = document.getElementById('kpdh-grid');
    if (!grid) return;

    grid.innerHTML = chars.map((c, i) => `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div class="char-img-placeholder" style="width: 60px; height: 60px; background: var(--accent-purple); border-radius: 50%; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">
                    ${c.name[0]}
                </div>
                <button class="fav-btn" data-id="kpdh-${i}" onclick="toggleFavorite('kpdh-${i}')">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <h3>${c.name}</h3>
            <p><strong>${c.role}</strong></p>
            <p style="color: var(--text-dim); font-size: 0.9rem;">${c.description}</p>
            <button class="btn btn-secondary" style="width: 100%;" onclick="openModal('<h3>${c.name}</h3><p>${c.role}</p><hr><p>${c.description}</p><p><em>Note: Fan-made lore.</em></p>')">
                Details
            </button>
        </div>
    `).join('');
    updateFavButtons();
}

async function renderNews() {
    const news = await fetchData('news.json');
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    grid.innerHTML = news.map(item => `
        <div class="card">
            <div class="news-tag" style="background: var(--accent-purple); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px; display: inline-block; margin-bottom: 0.5rem;">
                ${item.category}
            </div>
            <h3>${item.title}</h3>
            <p style="color: var(--text-dim); font-size: 0.8rem; margin-bottom: 1rem;">${item.date}</p>
            <p>${item.summary}</p>
            <button class="btn btn-secondary" style="width: 100%;" onclick="openModal('<h3>${item.title}</h3><p>Category: ${item.category}</p><hr><p>${item.summary}</p><p>Full article coming soon...</p>')">
                Read More
            </button>
        </div>
    `).join('');
}

async function renderEvents() {
    const events = await fetchData('events.json');
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    const now = new Date();
    grid.innerHTML = events.map((e, i) => {
        const start = new Date(e.start);
        const end = new Date(e.end);
        let status = '⚪ Ended';
        let style = { bg: '#e5e7eb', color: '#374151' };

        if (now < start) {
            status = '🟡 Upcoming';
            style = { bg: '#fef3c7', color: '#92400e' };
        } else if (now <= end) {
            status = '🟢 Active';
            style = { bg: '#dcfce7', color: '#166534' };
        }

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <div class="status-pill" style="font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: bold; background: ${style.bg}; color: ${style.color};">
                        ${status}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-dim);">${e.game}</span>
                </div>
                <h3>${e.name}</h3>
                <p style="font-size: 0.9rem; color: var(--text-dim);">${e.start} to ${e.end}</p>
                <p>${e.description}</p>
            </div>
        `;
    }).join('');
}

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateFavButtons();
};
