function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

async function doSearch(query) {
    if (!query) {
        document.getElementById('search-results').innerHTML = '';
        return;
    }
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    let html = '';
    const categories = {
        'cookies': '🍪 Cookie',
        'kpdh': '🎤 KPDH',
        'news': '📰 News',
        'events': '📅 Event'
    };

    for (const [key, items] of Object.entries(data)) {
        items.forEach(item => {
            const name = item.name || item.title;
            html += `
                <div class="search-item" onclick="location.href='/${key === 'cookies' ? 'cookies' : key === 'kpdh' ? 'kpdh' : key === 'news' ? 'news' : 'events'}'">
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
    
    const themeIcons = {
        'dark': 'fa-moon',
        'light': 'fa-sun',
        'kpdh': 'fa-bolt',
        'cookie': 'fa-cookie'
    };
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

window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateFavButtons();
};
