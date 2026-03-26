import { configure } from './api.js';
import { init as initCustomers } from './customers.js';

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

    initCustomers();
}

boot();
