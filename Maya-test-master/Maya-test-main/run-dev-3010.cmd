@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev -- -p 3010 > dev-3010.cmd.log 2>&1
