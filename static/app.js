import { configure } from './api.js';
import { init as initCustomers } from './customers.js';
import { init as initSales } from './sales.js';

async function boot() {
    try {
        const res = await fetch('/config');
        if (!res.ok) throw new Error(`Failed to load config (${res.status})`);
        const { celadonUrl } = await res.json();
        if (!celadonUrl) throw new Error('celadonUrl is not configured');
        configure(celadonUrl);
    } catch (err) {
        document.getElementById('app').innerHTML = `
            <div class="alert alert-danger mt-4" role="alert">
                <strong>Configuration error:</strong> ${err.message}
            </div>
        `;
        return;
    }

    function route() {
        const view = location.hash || '#sales';
        setActiveNav(view);
        if (view === '#customers') {
            initCustomers();
        } else {
            initSales();
        }
    }

    window.addEventListener('hashchange', route);
    route();
}

function setActiveNav(hash) {
    document.querySelectorAll('.nav-link[data-view]').forEach((el) => {
        el.classList.toggle('active', el.dataset.view === hash);
    });
}

boot();
