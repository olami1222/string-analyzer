# 🧠 String Analyzer API

A simple Node.js + Express REST API that analyzes strings and persists results to a JSON file (no database needed).

---

## 🚀 Features
- Analyze any string and store its:
  - Length
  - Whether it's a palindrome
  - SHA256 hash
  - Timestamp
- Data is persisted in a JSON file (`data.json`), so it survives restarts.
- Endpoints to create, read, delete, and fetch strings.

---

## ⚙️ Tech Stack
- **Node.js**
- **Express.js**
- **File System (fs) for JSON storage**
- **Nodemon (for auto-restart in development)**

---

## 🧩 Endpoints

### **POST /strings**
Analyze and store a new string.

**Request body:**
```json
{
  "value": "racecar"
}
Response:

json
Copy code
{
  "value": "racecar",
  "length": 7,
  "isPalindrome": true,
  "sha256_hash": "hash_value_here",
  "createdAt": "2025-10-25T19:20:37.114Z",
  "id": 1
}
GET /strings
Fetch all analyzed strings.

Response:

json
Copy code
[
  {
    "value": "racecar",
    "length": 7,
    "isPalindrome": true,
    "sha256_hash": "hash_value_here",
    "createdAt": "2025-10-25T19:20:37.114Z",
    "id": 1
  }
]
GET /strings/:value
Fetch a single string by its value.

DELETE /strings/:value
Delete a string from storage.

💻 Run Locally
Clone this repository

bash
Copy code
git clone https://github.com/<your-username>/string-analyzer.git
cd string-analyzer
Install dependencies

bash
Copy code
npm install
Start the server


nodemon server.js
Server runs on: http://localhost:3000

🧠 Example Usage (Postman)
POST → http://localhost:3000/strings

Body (JSON): { "value": "hello" }

GET → http://localhost:3000/strings

📝 Author
Olamide Wazir Akinwande

💡 Lighting Designer | Software Engineer 

📧 wazirolamide22@gmail.com

🌐 GitHub Profile



Then:
```bash
git add README.md
git commit -m "Added project README"
git push
2️⃣ Verify your repo looks good
Go to your GitHub repo page — you should now see:
✅ server.js
✅ data.json
✅ package.json
✅ README.md

3️⃣ (Optional but nice) Add a short project description
On your GitHub repo page (top area), click the ⚙️ Settings icon next to the description box, and write:

"A simple Express.js API that analyzes strings and stores results in JSON."
