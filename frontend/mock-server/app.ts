import express from 'express';
// import bodyParser from "body-parser";

const app = express();
const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));
app.use(express.json());

async function _handleResp(resp: Response, res): Promise<void> {
  if (!resp.ok) {
    res.status(resp.status).json({ error: `Failed to fetch: ${resp.statusText}` });
    return;
  }
  const data = await resp.json();
  res.status(200).json(data);
}

// F1 API endpoints
app.get('/drivers', async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/drivers');
  await _handleResp(resp, res);
});
app.get('/drivers/:id', async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/drivers/${req.params.id}`);
  await _handleResp(resp, res);
});
app.get('/teams', async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/teams');
  await _handleResp(resp, res);
});
app.get('/teams/:id', async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/teams/${req.params.id}`);
  await _handleResp(resp, res);
});
app.get('/races', async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current');
  if (!resp.ok) {
    res.status(resp.status).json({ error: `Failed to fetch: ${resp.statusText}` });
    return;
  }
  const data = await resp.json();
  data.races.forEach(race => race.video = 'https://www.youtube.com/embed/l3ahPJy22_o');
  res.status(200).json(data);
});

// Comments (mocked)
const mockComments = {
  australian_2025: [
    {
      id: 1,
      author: 'user1',
      content:
        "The Australian Grand Prix always delivers exciting racing, with its mix of high-speed straights and tight corners making Albert Park a real challenge for both drivers and teams.",
      timestamp: new Date('2025-08-01T10:05:30Z'),
    },
  ],
};
app.get('/comments/:id', async (req, res): Promise<void> => {
  console.log(`Fetching comments for ID ${req.params.id}...`);
  res.status(200).json(mockComments[req.params.id] ?? []);
});
app.post('/comments/:id', async (req, res): Promise<void> => {
  console.log(`Posting comments for ID ${req.params.id}...`);
  if (!mockComments[req.params.id]) mockComments[req.params.id] = [];
  mockComments[req.params.id].push({ ...req.body, id: Date.now(), timestamp: new Date() });
  res.status(200).json({ completed: true });
});
app.put('/comments/:id', async (req, res): Promise<void> => {
  console.log(`Updating comments for ID ${req.params.id} and comment id ${req.body.id}...`);
  const comment = mockComments[req.params.id].find((comment) => comment.id === Number(req.body.id));
  comment.content = req.body.content;
  res.status(200).json({ completed: true });
});
app.delete('/comments/:id/:commentId', async (req, res): Promise<void> => {
  console.log(`Deleting comments for ID ${req.params.id} and comment id ${req.params.commentId}...`);
  mockComments[req.params.id] = mockComments[req.params.id].filter((comment) => comment.id !== Number(req.params.commentId));
  res.status(200).json({ completed: true });
});

// Favourites
const favouriteDrivers = {};
const favouriteTeams = {};
app.post('/favourites/driver/:driverId/:userId', async (req, res): Promise<void> => {
  console.log(`Toggling favourite for driver ID ${req.params.driverId} and user ${req.params.userId}...`, JSON.stringify(req.body));
  if (!favouriteDrivers[req.params.userId]) favouriteDrivers[req.params.userId] = {};
  favouriteDrivers[req.params.userId][req.params.driverId] = req.body.favourite;
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: `Favourite status for driver ID ${req.params.driverId} toggled. ${req.body}` });
});
app.get('/favourites/driver/:driverId/:userId', async (req, res): Promise<void> => {
  console.log(`Get favourite for driver ID ${req.params.driverId} and user ${req.params.userId}...`);
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ favourite: favouriteDrivers?.[req.params.userId]?.[req.params.driverId] ?? false });
});
app.post('/favourites/team/:teamId/:userId', async (req, res): Promise<void> => {
  console.log(`Toggling favourite for team ID ${req.params.teamId} and user ${req.params.teamId}...`, JSON.stringify(req.body));
  if (!favouriteTeams[req.params.userId]) favouriteTeams[req.params.userId] = {};
  favouriteTeams[req.params.userId][req.params.teamId] = req.body.favourite;
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: `Favourite status for driver ID ${req.params.teamId} toggled. ${req.body}` });
});
app.get('/favourites/team/:teamId/:userId', async (req, res): Promise<void> => {
  console.log(`Get favourite for team ID ${req.params.teamId} and user ${req.params.userId}...`);
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ favourite: favouriteTeams?.[req.params.userId]?.[req.params.teamId] ?? false });
});

// Authentication (mocked)
app.post('/auth/login', async (req, res): Promise<void> => {
  console.log(`Auth login...`, JSON.stringify(req.body));
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ token: '1a2s3d4f', userId: '1234' });
});
app.post('/auth/signup', async (req, res): Promise<void> => {
  console.log(`Auth signup...`, JSON.stringify(req.body));
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: 'Signup successful' });
});
app.get('/auth/logout', async (req, res): Promise<void> => {
  console.log(`Auth logout...`, JSON.stringify(req.body));
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: 'Logout successful' });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
