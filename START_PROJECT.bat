@echo off
echo ========================================
echo   Demarrage du projet DevHunt 2025
echo ========================================
echo.

REM Démarrer le backend
echo [1/2] Demarrage du serveur backend...
start "Backend Server" cmd /k "cd /d "%~dp0server" && start_server.bat"

timeout /t 3 /nobreak >nul

REM Démarrer le frontend
echo [2/2] Demarrage du client frontend...
start "Frontend Client" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================
echo   Projet demarre!
echo ========================================
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://localhost:5173
echo ========================================
echo.

pause