import express from "express";
// import bodyParser from "body-parser";

const app = express();
const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("dist"));

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

app.get("/races", async (req, res): Promise<void> => {
  const resp: Response = await fetch('https://f1api.dev/api/current');
  const data = await resp.json();
  res.status(200).json(data);
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
