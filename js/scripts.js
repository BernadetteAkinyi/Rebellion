/**
 * REBELLION BLOG - Interactive Scripts
 * Search filtering, category tabs, bookmarks, reader modal, and dispatch subscription
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('button-search');
    const articles = document.querySelectorAll('.blog-article-item');
    const filterPills = document.querySelectorAll('.filter-pill');
    const categoryLinks = document.querySelectorAll('.category-filter-link');
    const searchCountEl = document.getElementById('search-results-count');
    const toastEl = document.getElementById('tech-toast');
    const toastMsgEl = document.getElementById('toast-message');
    const subscribeForm = document.getElementById('subscribe-form');
    const emailInput = document.getElementById('subscribe-email');

    let currentCategory = 'all';
    let currentSearchQuery = '';

    // Toast helper
    function showToast(message, duration = 3000) {
        if (!toastEl || !toastMsgEl) return;
        toastMsgEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(toastEl._timer);
        toastEl._timer = setTimeout(() => {
            toastEl.classList.remove('show');
        }, duration);
    }

    // Filter Logic
    function filterArticles() {
        let visibleCount = 0;
        const q = currentSearchQuery.trim().toLowerCase();

        articles.forEach(article => {
            const title = (article.querySelector('.card-title')?.textContent || '').toLowerCase();
            const text = (article.querySelector('.card-text')?.textContent || '').toLowerCase();
            const category = (article.getAttribute('data-category') || '').toLowerCase();
            const tags = (article.getAttribute('data-tags') || '').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = !q || title.includes(q) || text.includes(q) || tags.includes(q);

            if (matchesCategory && matchesSearch) {
                article.style.display = '';
                visibleCount++;
            } else {
                article.style.display = 'none';
            }
        });

        // Search feedback
        if (searchCountEl) {
            if (q || currentCategory !== 'all') {
                searchCountEl.classList.remove('d-none');
                searchCountEl.innerHTML = `Showing <strong>${visibleCount}</strong> article${visibleCount === 1 ? '' : 's'} ${currentCategory !== 'all' ? `in <em>${currentCategory}</em>` : ''} ${q ? `matching "<em>${escapeHtml(q)}</em>"` : ''} <a href="javascript:void(0)" id="reset-filters" class="ms-2 text-warning text-decoration-underline" style="font-size: 0.85rem;">Reset filter</a>`;
                
                const resetBtn = document.getElementById('reset-filters');
                if (resetBtn) {
                    resetBtn.addEventListener('click', resetFilters);
                }
            } else {
                searchCountEl.classList.add('d-none');
            }
        }

        // Show empty state if nothing found
        const noResultsEl = document.getElementById('no-results-state');
        if (noResultsEl) {
            noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    function resetFilters() {
        currentCategory = 'all';
        currentSearchQuery = '';
        if (searchInput) searchInput.value = '';
        filterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'all'));
        filterArticles();
    }

    // Search events
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            filterArticles();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                currentSearchQuery = e.target.value;
                filterArticles();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                currentSearchQuery = searchInput.value;
                filterArticles();
            }
        });
    }

    // Filter pills (Category tabs)
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = (pill.getAttribute('data-filter') || 'all').toLowerCase();
            filterArticles();
        });
    });

    // Category sidebar links
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = (link.getAttribute('data-category') || 'all').toLowerCase();
            currentCategory = cat;
            
            // Sync filter pills
            filterPills.forEach(p => {
                p.classList.toggle('active', (p.getAttribute('data-filter') || '').toLowerCase() === cat);
            });

            filterArticles();
            
            // Scroll to blog feed smoothly
            const feed = document.getElementById('blog-feed-anchor');
            if (feed) {
                feed.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Bookmarks toggle
    document.querySelectorAll('.btn-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            const isSaved = btn.classList.contains('active');
            const icon = btn.querySelector('i') || btn;
            
            if (isSaved) {
                showToast('Article saved to your Rebellion reading list');
            } else {
                showToast('Article removed from reading list');
            }
        });
    });

    // Newsletter Subscribe Form
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email address.');
                return;
            }

            // Simulate dispatch registration
            showToast(`Welcome to the Rebellion! Dispatch sent to ${email}`);
            if (emailInput) emailInput.value = '';
        });
    }
});