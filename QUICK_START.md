# Quick Start Guide

## 🚀 Starting the Development Server

### ⚠️ If You See a Blank Page
1. **Stop all servers**: Close any terminal windows running `npm start` or `npm run dev`
2. **Clear browser cache**: Press `Ctrl + Shift + Delete` and clear cached files
3. **Restart fresh**: Run `npm start` again
4. **Check console**: Press `F12` in browser, look for errors in Console tab

## 🚀 Starting the Development Server

### Option 1: Using npm start (Recommended)
```bash
npm start
```
This will automatically:
- Start the Vite dev server on port 8080
- Open your browser to http://localhost:8080

### Option 2: Using npm run dev
```bash
npm run dev
```
Then manually open: **http://localhost:8080**

### Option 3: Using npm run serve (Network Access)
```bash
npm run serve
```
This allows access from other devices on your network.

## ⚠️ Important Notes

### Why Go Live (Live Server) Won't Work
- **Go Live** (VS Code Live Server extension) runs on port **5500**
- This project uses **Vite**, which needs port **8080**
- Live Server is for static HTML files, not React/Vite applications
- Vite needs to bundle and process your React/TypeScript code

### The Correct URL
- ✅ **CORRECT:** `http://localhost:8080`
- ✅ **CORRECT:** `http://127.0.0.1:8080`
- ❌ **WRONG:** `http://localhost:5500` (Live Server)
- ❌ **WRONG:** `http://127.0.0.1:5500` (Live Server)

## 🔧 Troubleshooting

### Port 8080 Already in Use
If you see an error about port 8080 being busy:
1. Close other applications using port 8080
2. Or the server will automatically try the next available port
3. Check the terminal output for the actual URL

### Server Not Starting
1. Make sure you're in the project directory
2. Run `npm install` if you haven't already
3. Check for error messages in the terminal

### Browser Not Opening Automatically
- The server will show the URL in the terminal
- Manually open: `http://localhost:8080`

## 📝 VS Code Integration

If you want to use VS Code's "Go Live" feature:
1. Install the "Live Server" extension
2. Right-click on `public/go-live-redirect.html`
3. Select "Open with Live Server"
4. It will redirect you to the correct port

**But the best way is to use `npm start`!**

## 🎯 Quick Reference

| Command | What it does |
|---------|-------------|
| `npm start` | Start server + auto-open browser |
| `npm run dev` | Start server (manual browser) |
| `npm run serve` | Start server (network access) |
| `npm run build` | Build for production |

---

**Remember:** Always use port **8080**, not 5500!

