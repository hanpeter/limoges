import express from 'express';

const port = process.env.PORT || 9001;
const app = express();

app.get('/healthz', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/livez', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/config', (req, res) => {
    res.json({
        celadonUrl: process.env.CELADON_URL,
    });
});

app.use(express.static('static'));

const server = app.listen(port, (error) => {
    if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
    console.log(`Limoges listening on port ${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('HTTP server closed');
    });
});
