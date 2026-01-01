const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

// Google OAuth2 setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/calendar/auth/callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

let auth = null; // Will hold OAuth2 tokens in memory (for demo)

// Initialize Google Calendar API
const calendar = google.calendar('v3');

// GET /api/calendar/events - Get calendar events
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate, maxResults = 10 } = req.body;

    if (!auth) {
      return res.status(401).json({ 
        error: 'Calendar not authenticated',
        message: 'Please authenticate with Google Calendar first'
      });
    }

    // TODO: Implement actual Google Calendar API call
    // const response = await calendar.events.list({
    //   auth: auth,
    //   calendarId: 'primary',
    //   timeMin: startDate || new Date().toISOString(),
    //   timeMax: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    //   maxResults: maxResults,
    //   singleEvents: true,
    //   orderBy: 'startTime',
    // });

    // Placeholder response
    const events = [
      {
        id: '1',
        summary: 'Team Meeting',
        start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
        end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() },
        description: 'Weekly team sync',
        location: 'Conference Room'
      },
      {
        id: '2',
        summary: 'Client Call',
        start: { dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
        end: { dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() },
        description: 'Project discussion with client',
        location: 'Zoom'
      }
    ];

    res.json({ events });

  } catch (error) {
    console.error('Calendar Events Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch calendar events',
      details: error.message 
    });
  }
});

// POST /api/calendar/events - Create calendar event
router.post('/events', async (req, res) => {
  try {
    const { summary, description, startTime, endTime, attendees = [], location = '' } = req.body;

    if (!summary || !startTime || !endTime) {
      return res.status(400).json({ 
        error: 'Summary, start time, and end time are required' 
      });
    }

    if (!auth) {
      return res.status(401).json({ 
        error: 'Calendar not authenticated',
        message: 'Please authenticate with Google Calendar first'
      });
    }

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      location,
      attendees: attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    // TODO: Implement actual Google Calendar API call
    // const response = await calendar.events.insert({
    //   auth: auth,
    //   calendarId: 'primary',
    //   resource: event,
    // });

    console.log('Creating calendar event:', event);

    // Placeholder response
    res.json({
      id: Date.now().toString(),
      ...event,
      status: 'confirmed',
      created: new Date().toISOString()
    });

  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ 
      error: 'Failed to create calendar event',
      details: error.message 
    });
  }
});

// PUT /api/calendar/events/:id - Update calendar event
router.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, description, startTime, endTime, attendees } = req.body;

    if (!auth) {
      return res.status(401).json({ 
        error: 'Calendar not authenticated' 
      });
    }

    // TODO: Implement actual Google Calendar API call
    console.log('Updating calendar event:', id);

    res.json({
      id,
      status: 'updated',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ 
      error: 'Failed to update calendar event',
      details: error.message 
    });
  }
});

// DELETE /api/calendar/events/:id - Delete calendar event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!auth) {
      return res.status(401).json({ 
        error: 'Calendar not authenticated' 
      });
    }

    // TODO: Implement actual Google Calendar API call
    // await calendar.events.delete({
    //   auth: auth,
    //   calendarId: 'primary',
    //   eventId: id,
    // });

    console.log('Deleting calendar event:', id);

    res.json({
      message: 'Event deleted successfully',
      id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ 
      error: 'Failed to delete calendar event',
      details: error.message 
    });
  }
});

// GET /api/calendar/auth - Get authentication status
router.get('/auth', async (req, res) => {
  try {
    res.json({
      authenticated: !!auth,
      message: auth ? 'Calendar is connected' : 'Calendar not connected'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

// POST /api/calendar/auth - Start OAuth2 flow
router.post('/auth', async (req, res) => {
  try {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
    res.json({
      message: 'Authentication flow initiated',
      authUrl
    });
  } catch (error) {
    console.error('Calendar Auth Error:', error);
    res.status(500).json({
      error: 'Failed to initiate authentication',
      details: error.message
    });
  }
});

// GET /api/calendar/auth/callback - Handle OAuth2 redirect
router.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'Missing code in callback' });
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    auth = oauth2Client; // Store in memory (for demo)
    // In production, store tokens securely per user
    res.send('Google Calendar authenticated! You can close this window.');
  } catch (error) {
    console.error('OAuth2 Callback Error:', error);
    res.status(500).send('Failed to authenticate with Google Calendar.');
  }
});

module.exports = router; 