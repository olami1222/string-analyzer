# 🧠 String Analyzer API

A simple Node.js + Express API that analyzes strings and saves the results in a JSON file.

## 🚀 Features
- Calculates string length
- Checks if it’s a palindrome
- Generates SHA256 hash
- Stores data persistently in `data.json`

## 🧩 Endpoints

### POST /strings
Analyze and save a new string  
**Body:**
```json
{ "value": "racecar" }
GET /strings
Get all analyzed strings

GET /strings/:value
Get one analyzed string

DELETE /strings/:value
Delete a string

💻 Run Locally
bash
Copy code
git clone https://github.com/<your-username>/string-analyzer.git
cd string-analyzer
npm install
nodemon server.js
Server runs at: http://localhost:3000

🧑‍💻 Author
Olamide Wazir Akinwande
