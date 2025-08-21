const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Base URL for Hi-anime API
const HI_ANIME_BASE_URL = 'https://hianime.to';

// Routes

// Root route - serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API Routes

// Get trending anime
app.get('/api/trending', async (req, res) => {
    try {
        // Placeholder - implement Hi-anime API integration
        res.json({
            message: 'Trending anime endpoint',
            data: []
        });
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        res.status(500).json({ error: 'Failed to fetch trending anime' });
    }
});

// Search anime
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }
        
        // Placeholder - implement Hi-anime API search integration
        res.json({
            message: 'Search anime endpoint',
            query: q,
            data: []
        });
    } catch (error) {
        console.error('Error searching anime:', error);
        res.status(500).json({ error: 'Failed to search anime' });
    }
});

// Get anime details
app.get('/api/anime/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Placeholder - implement Hi-anime API anime details integration
        res.json({
            message: 'Anime details endpoint',
            id: id,
            data: {}
        });
    } catch (error) {
        console.error('Error fetching anime details:', error);
        res.status(500).json({ error: 'Failed to fetch anime details' });
    }
});

// Get anime episodes
app.get('/api/anime/:id/episodes', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Placeholder - implement Hi-anime API episodes integration
        res.json({
            message: 'Episodes endpoint',
            id: id,
            episodes: []
        });
    } catch (error) {
        console.error('Error fetching episodes:', error);
        res.status(500).json({ error: 'Failed to fetch episodes' });
    }
});

// Get streaming sources
app.get('/api/watch/:episodeId', async (req, res) => {
    try {
        const { episodeId } = req.params;
        
        // Placeholder - implement Hi-anime API streaming sources integration
        res.json({
            message: 'Streaming sources endpoint',
            episodeId: episodeId,
            sources: []
        });
    } catch (error) {
        console.error('Error fetching streaming sources:', error);
        res.status(500).json({ error: 'Failed to fetch streaming sources' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend served at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
