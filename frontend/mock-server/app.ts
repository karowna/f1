import express from "express";
// import bodyParser from "body-parser";

const app = express();
const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(express.json())

app.get("/drivers", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/drivers');
  const data = await resp.json();
  res.status(200).json(data);
});

app.get("/drivers/:id", async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/drivers/${req.params.id}`);
  const data = await resp.json();
  res.status(200).json(data);
});

app.get("/teams", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current/teams');
  const data = await resp.json();
  res.status(200).json(data);
});

app.get("/teams/:id", async (req, res): Promise<void> => {
  const resp: Response = await fetch(`https://f1api.dev/api/current/teams/${req.params.id}`);
  const data = await resp.json();
  res.status(200).json(data);
});

app.get("/races", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current');
  const data = await resp.json();
  res.status(200).json(data);
});

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
