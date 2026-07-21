@echo off
title 天命阁 - 开放防火墙端口
echo ========================================
echo  天命阁 - 开放防火墙端口 8765
echo ========================================
echo.
echo 正在请求管理员权限添加防火墙规则...
echo 如果弹出 UAC 窗口，请点击"是"。
echo.
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo 正在以管理员身份重新运行...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

netsh advfirewall firewall add rule name="天命阁 算命大师" dir=in action=allow protocol=TCP localport=8765

echo.
echo 防火墙规则已添加！
echo 现在你可以在手机上访问: http://192.168.88.211:8765
echo.
pause
