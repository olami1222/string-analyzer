import express from "express";
import fs from "fs-extra";
import crypto from "crypto";

const app = express();
app.use(express.json());

const DATA_FILE = "./data.json";

if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, []);
}

function getHash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}


app.get("/", (req, res) => {
  res.send("✅ String Analyzer API is live!");
});

app.post("/api/strings", async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ error: "Missing 'value' field" });
    }

    const data = await fs.readJson(DATA_FILE);
    const hash = getHash(value);

    
    const exists = data.find((s) => s.sha256_hash === hash);
    if (exists) {
      return res.status(400).json({ error: "String already exists in the system" });
    }

    const record = {
      id: data.length + 1,
      value,
      length: value.length,
      isPalindrome: value === value.split("").reverse().join(""),
      sha256_hash: hash,
      createdAt: new Date().toISOString()
    };

    data.push(record);
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });

    res.json(record);
  } catch (err) {
    console.error("POST /api/strings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/strings", async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    res.json(data);
  } catch (err) {
    console.error("GET /api/strings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/strings/:id", async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    const found = data.find((s) => s.id === parseInt(req.params.id));
    if (!found) {
      return res.status(404).json({ error: "String not found" });
    }
    res.json(found);
  } catch (err) {
    console.error("GET /api/strings/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
