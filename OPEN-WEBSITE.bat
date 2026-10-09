@echo off
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 goto usepy
where python >nul 2>nul
if not errorlevel 1 goto usepython
echo Python 3 is needed for the local preview. Install Python 3 and try again.
pause
goto :eof
:usepy
py -3 local-preview.py
goto :eof
:usepython
python local-preview.py
