# Fix Blank Page Issue

## Quick Fix Steps

### Step 1: Stop All Running Servers
```bash
# Option A: Use the restart script (Windows)
.\restart-server.bat

# Option B: Manual stop (PowerShell)
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Step 2: Clear Browser Cache
1. Press `Ctrl + Shift + Delete` in your browser
2. Select "Cached images and files"
3. Click "Clear data"

### Step 3: Start Fresh
```bash
npm start
```

### Step 4: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for any red error messages
4. Share any errors you see

## Common Issues & Solutions

### Issue 1: Blank White Page
**Cause:** JavaScript error preventing React from rendering

**Solution:**
1. Open browser console (F12)
2. Check for errors in Console tab
3. Check Network tab for failed requests (red items)
4. Try hard refresh: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

### Issue 2: "Cannot GET /"
**Cause:** Server not running or wrong port

**Solution:**
```bash
npm start
```
Wait for: `➜  Local:   http://localhost:8080/`

### Issue 3: Port Already in Use
**Cause:** Another process using port 8080

**Solution:**
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Issue 4: Module Not Found Errors
**Cause:** Dependencies not installed

**Solution:**
```bash
npm install
npm start
```

## Diagnostic Commands

Run these to check everything:

```bash
# Check if server is running
netstat -ano | findstr :8080

# Check Node processes
Get-Process | Where-Object {$_.ProcessName -eq "node"}

# Verify dependencies
npm list --depth=0

# Reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

## Still Not Working?

1. **Check the terminal output** - Look for error messages when running `npm start`
2. **Check browser console** - Press F12, look at Console and Network tabs
3. **Try a different browser** - Test in Chrome, Firefox, Edge
4. **Try incognito mode** - Rules out browser extensions
5. **Check firewall** - Make sure port 8080 isn't blocked

## Expected Behavior

When working correctly:
- Terminal shows: `➜  Local:   http://localhost:8080/`
- Browser automatically opens to `http://localhost:8080`
- You see the DES MentorConnect homepage
- No errors in browser console

