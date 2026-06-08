@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"

if exist "%ProgramFiles%\Git\bin\bash.exe" (
  set "BASH_EXE=%ProgramFiles%\Git\bin\bash.exe"
) else if exist "%ProgramFiles(x86)%\Git\bin\bash.exe" (
  set "BASH_EXE=%ProgramFiles(x86)%\Git\bin\bash.exe"
) else (
  where bash >nul 2>nul
  if %ERRORLEVEL%==0 (
    set "BASH_EXE=bash"
  ) else (
    echo [error] bash executable not found.
    echo [error] Install Git for Windows or make bash available in PATH, then run deploy.bat again.
    exit /b 1
  )
)

"%BASH_EXE%" "%ROOT_DIR%\deploy.sh" %*
exit /b %ERRORLEVEL%
