const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const app = express();
const DATA_FILE = "./data.json";

app.use(express.json());

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readData() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return data.trim() ? JSON.parse(data) : [];
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function analyzeString(value) {
  const cleaned = value.toLowerCase().replace(/\s+/g, "");
  const is_palindrome = cleaned === cleaned.split("").reverse().join("");
  const words = value.trim().split(/\s+/).filter(Boolean);
  const freq = {};
  for (const char of value) {
    freq[char] = (freq[char] || 0) + 1;
  }

  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  return {
    length: value.length,
    is_palindrome,
    unique_characters: new Set(value).size,
    word_count: words.length,
    sha256_hash,
    character_frequency_map: freq,
  };
}

app.get("/", (req, res) => {
  res.send("✅ String Analyzer API is running!");
});

app.post("/strings", (req, res) => {
  const { value } = req.body;
  if (typeof value !== "string") {
    return res.status(422).json({ error: "Value must be a string" });
  }
  if (!value.trim()) {
    return res.status(400).json({ error: "Missing 'value' field" });
  }

  const strings = readData();
  const hash = crypto.createHash("sha256").update(value).digest("hex");

  const existing = strings.find((s) => s.properties && s.properties.sha256_hash === hash);
  if (existing) {
    return res.status(409).json({ error: "String already exists in the system" });
  }

  const analyzed = analyzeString(value);
  const record = {
    id: analyzed.sha256_hash,
    value,
    properties: analyzed,
    created_at: new Date().toISOString(),
  };

  strings.push(record);
  writeData(strings);
  res.status(201).json(record);
});

app.get("/strings", (req, res) => {
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
  let strings = readData();

  if (is_palindrome !== undefined) {
    const boolVal = is_palindrome === "true";
    strings = strings.filter((s) => s.properties.is_palindrome === boolVal);
  }
  if (min_length) {
    strings = strings.filter((s) => s.properties.length >= parseInt(min_length));
  }
  if (max_length) {
    strings = strings.filter((s) => s.properties.length <= parseInt(max_length));
  }
  if (word_count) {
    strings = strings.filter((s) => s.properties.word_count === parseInt(word_count));
  }
  if (contains_character) {
    strings = strings.filter((s) => s.value.includes(contains_character));
  }

  res.json({
    data: strings,
    count: strings.length,
    filters_applied: req.query,
  });
});

app.get("/strings/:string_value", (req, res) => {
  const strings = readData();
  const string_value = req.params.string_value;
  const found = strings.find((s) => s.value === string_value);
  if (!found) {
    return res.status(404).json({ error: "String not found" });
  }
  res.json(found);
});

app.delete("/strings/:string_value", (req, res) => {
  let strings = readData();
  const string_value = req.params.string_value;
  const index = strings.findIndex((s) => s.value === string_value);
  if (index === -1) {
    return res.status(404).json({ error: "String not found" });
  }

  strings.splice(index, 1);
  writeData(strings);
  res.status(204).send();
});

app.get("/strings/filter-by-natural-language", (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const lower = query.toLowerCase();
  const filters = {};

  if (lower.includes("palindromic")) filters.is_palindrome = true;
  if (lower.includes("single word")) filters.word_count = 1;
  if (lower.includes("longer than")) {
    const num = parseInt(lower.match(/longer than (\d+)/)?.[1]);
    if (num) filters.min_length = num + 1;
  }
  const matchChar = lower.match(/containing the letter ([a-z])/);
  if (matchChar) filters.contains_character = matchChar[1];

  if (Object.keys(filters).length === 0) {
    return res.status(400).json({ error: "Unable to parse natural language query" });
  }

  
  let strings = readData();
  if (filters.is_palindrome)
    strings = strings.filter((s) => s.properties.is_palindrome);
  if (filters.word_count)
    strings = strings.filter((s) => s.properties.word_count === filters.word_count);
  if (filters.min_length)
    strings = strings.filter((s) => s.properties.length >= filters.min_length);
  if (filters.contains_character)
    strings = strings.filter((s) => s.value.includes(filters.contains_character));

  res.json({
    data: strings,
    count: strings.length,
    interpreted_query: {
      original: query,
      parsed_filters: filters,
    },
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
