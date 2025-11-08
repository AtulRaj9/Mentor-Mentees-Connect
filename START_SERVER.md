# How to Start the Development Server

## Quick Start

1. **Open a terminal/command prompt in this folder**

2. **Run the following command:**
   ```bash
   npm run dev
   ```

3. **Wait for the server to start** - You should see:
   ```
   ➜  Local:   http://localhost:8080/
   ➜  Network: http://[your-ip]:8080/
   ```

4. **Open your browser and go to:**
   - ✅ **CORRECT:** `http://localhost:8080`
   - ✅ **CORRECT:** `http://127.0.0.1:8080`
   - ❌ **WRONG:** `http://127.0.0.1:5500` (This is a different server!)

## Alternative: Use the start script

You can also use:
```bash
npm start
```

This will automatically open the browser to the correct URL.

## Troubleshooting

### If you see "Connection Refused"
- Make sure the dev server is running (check the terminal)
- Make sure you're using port **8080**, not 5500
- Try stopping any other servers that might be using port 8080

### If the page is blank
- Check the browser console (F12) for errors
- Make sure all dependencies are installed: `npm install`
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### If port 8080 is already in use
- The server will show an error message
- Close other applications using port 8080
- Or change the port in `vite.config.ts`

## Important Notes

- **Port 5500** is used by Live Server (VS Code extension) - this won't work with React/Vite
- **Port 8080** is the correct port for this Vite development server
- Always use `http://localhost:8080` or `http://127.0.0.1:8080`

