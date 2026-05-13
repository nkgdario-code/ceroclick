@echo off
echo ============================================
echo  CEROCLICK DEPLOY SCRIPT
echo ============================================
echo.

REM Cambia estos datos
set GITHUB_USER=TU_USUARIO_GITHUB
set REPO_NAME=ceroclick
set GITHUB_EMAIL=tu@email.com

REM 1. Git init (si no existe)
echo [1/6] Inicializando Git...
git init 2>nul
git remote set-url origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git 2>nul

REM 2. Commit
echo [2/6] Haciendo commit...
git add .
for /f "tokens=1-3 delims=/" %%a in ('date /t') do set TODAY=%%c-%%b-%%a
git commit -m "Update - %TODAY%"

REM 3. Push
echo [3/6] Subiendo a GitHub...
git branch -M main
git push -u origin main --force

REM 4. Mensaje
echo.
echo ============================================
echo  ^! Desplegado en Vercel automáticamente ^!
echo ============================================
echo.
pause