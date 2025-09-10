import express from "express";
// import bodyParser from "body-parser";

const app = express();
const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(express.json())

async function _handleResp(resp: Response, res): Promise<void> {
  if (!resp.ok) {
    res.status(resp.status).json({ error: `Failed to fetch: ${resp.statusText}` });
    return;
  }
  const data = await resp.json();
  res.status(200).json(data);
}

// F1 API endpoints
app.get("/drivers", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/drivers');
  await _handleResp(resp, res);
});
app.get("/drivers/:id", async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/drivers/${req.params.id}`);
  await _handleResp(resp, res);
});
app.get("/teams", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/teams');
  await _handleResp(resp, res);
});
app.get("/teams/:id", async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/teams/${req.params.id}`);
  await _handleResp(resp, res);
});
app.get("/races", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current');
  await _handleResp(resp, res);
});

// Comments (mocked)
const mockComments = { australian_2025: [
  { id: 1, author: 'user1', content: 'djfhjds kdjksajdksa kjdksjfkd kkjfksdf kjdfksdjf kjfkjfsd', timestamp: new Date('2024-03-01T10:00:00Z') },
]};
app.get("/comments/:id", async (req, res): Promise<void> => {
  console.log(`Fetching comments for ID ${req.params.id}...`);
  res.status(200).json(mockComments[req.params.id] ?? []);
});
app.post("/comments/:id", async (req, res): Promise<void> => {
  console.log(`Posting comments for ID ${req.params.id}...`);
  if (!mockComments[req.params.id]) mockComments[req.params.id] = [];
  mockComments[req.params.id].push({ ...req.body, id: Date.now(), timestamp: new Date() });
  res.status(200).json({completed: true});
});
app.put("/comments/:id", async (req, res): Promise<void> => {
  console.log(`Updating comments for ID ${req.params.id}...`);
  const comment = mockComments[req.params.id].find((comment) => comment.id === req.body.id);
  comment.content = req.body.content;
  res.status(200).json({completed: true});
});
app.delete("/comments/:id", async (req, res): Promise<void> => {
  console.log(`Deleting comments for ID ${req.params.id}...`);
  mockComments[req.params.id] = mockComments[req.params.id].filter((comment) => comment.id !== req.body.id);
  res.status(200);
});

// Favourites
app.post("/favourites/driver/:id", async (req, res): Promise<void> => {
  console.log(`Toggling favourite for driver ID ${req.params.id}...`, JSON.stringify(req.body));
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: `Favourite status for driver ID ${req.params.id} toggled. ${req.body}` });
});
app.post("/favourites/team/:id", async (req, res): Promise<void> => {
  console.log(`Toggling favourite for team ID ${req.params.id}...`, JSON.stringify(req.body));
  await require('util').promisify(setTimeout)(500);
  res.status(200).json({ message: `Favourite status for driver ID ${req.params.id} toggled. ${req.body}` });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
