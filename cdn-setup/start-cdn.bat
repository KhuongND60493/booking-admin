@echo off
rem Chạy từ đúng thư mục chứa file này, bất kể được gọi từ đâu.
cd /d "%~dp0"

call config.bat

rem Cho phép override port tạm thời: start-cdn.bat 9000
if not "%~1"=="" set PORT=%~1

echo.
echo ============================================
echo  Serving %cd% on port %PORT% (CORS enabled)
echo  registry.json vd: http://localhost:%PORT%/booking-admin/registry.json
echo  Nhan Ctrl+C de dung server.
echo ============================================
echo.

npx serve . -l %PORT% --cors
