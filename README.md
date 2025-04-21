## Prerequisites

- **Node.js** v14+ installed
- **A Terminal** (Windows) or any terminal (macOS/Linux)
- **Express and uuid** Installed wiuth npm install
- **package.json** Adding Dependencies for express and uuid versions, as well as scripts for starting
---

## Installation & Run

1. **Clone or download** this repository and open a terminal in its root:
   ```powershell
   cd C:\path\to\receipt-processor
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```


3. **Start the server** on port 3000:
   ```powershell
   node server.js 3000
   ```

   You should see:
   ```text
   Server listening on port 3000
   ```

---

## Testing

Open a second terminal window in the same project folder for testing.

### 1. Submit a Receipt

**For the Morning Receipt**
```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/receipts/process `
  -ContentType 'application/json' `
  -InFile .\examples\morning-receipt.json
```

**For the Simple Receipt**
```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/receipts/process `
  -ContentType 'application/json' `
  -InFile .\examples\simple-receipt.json
```

Each returns a JSON object with a generated `id`, for example:
```json
{ "id": "3f1b2e7c-9d8a-4a3b-812a-0f1234567890" }
```

ID generation was done with uuidv4, version 9.0.0

### 2. Retrieve Points

Use the returned `<id>` in the GET request:
```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri http://localhost:3000/receipts/<id>/points
```

Response:
```json
{ "points": XX }
```

Replace <id> with the actual UUID from the POST response.

---

## Final Thoughts

- I used Node.js beacuse that is what im comfortable with.
- I didnt use docker or any type of databse solution for this test.
- This is barebones, just the code to make sure everything works. Im actually used to building React frontends to interact with express API calling.
- When doing installation a pakcage-lock.json file will be created as well as node modules, I removed these files from being added to Github.




