@echo off
echo ========================================
echo    Demarrage du serveur FastAPI
echo ========================================
echo.

cd /d "%~dp0"

REM Activation de l'environnement virtuel
if exist ".env\Scripts\activate.bat" (
    echo Activation de l'environnement virtuel...
    call .env\Scripts\activate.bat
) else (
    echo ATTENTION: Environnement virtuel non trouve!
    echo Verifiez que .env existe dans le dossier server
    pause
    exit /b 1
)

echo.
echo Demarrage du serveur sur http://127.0.0.1:8000
echo WebSocket disponible sur ws://127.0.0.1:8000/ws/transcribe
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

uvicorn main:app --reload --host 127.0.0.1 --port 8000

pause