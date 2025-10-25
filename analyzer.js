// analyzer.js
const crypto = require("crypto");

function analyzeString(value) {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }

  const length = value.length;
  const lowerValue = value.toLowerCase().replace(/\s+/g, ""); // ignore spaces for palindrome check
  const is_palindrome = lowerValue === lowerValue.split("").reverse().join("");
  const unique_characters = new Set(value).size;
  const word_count = value.trim().split(/\s+/).filter(Boolean).length;
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  const character_frequency_map = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
}

module.exports = { analyzeString };
