# String Analyzer API

A simple REST API that analyzes strings and stores their properties in a JSON file.

## Features
- Analyze strings for:
  - Length
  - Palindrome check
  - SHA256 hash
- Stores results in `data.json`
- Prevents duplicate entries

## Endpoints

### POST /analyze
Analyze and save a string.

**Body Example:**
```json
{ "value": "racecar" }
