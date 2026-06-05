@echo off
setlocal

cd /d "%~dp0"

if not exist ".env" (
  if exist ".env.example" (
    copy /Y ".env.example" ".env" >nul
  )
)

if not exist "node_modules\\.bin\\tsx.cmd" (
  echo [setup] Installing workspace dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

if not exist "node_modules\\.bin\\next.cmd" (
  echo [setup] Installing workspace dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

if not exist "apps\\api\\.local" mkdir "apps\\api\\.local"

echo [start] Opening API window on http://localhost:4000
start "Anomaly API" cmd /k "cd /d %~dp0 && npm run dev:api"

echo [start] Opening WEB window on http://localhost:3000
start "Anomaly WEB" cmd /k "cd /d %~dp0 && npm run dev:web"

echo API and WEB start commands were launched.
exit /b 0
