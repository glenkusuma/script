@echo off
setlocal enabledelayedexpansion
:: Initialization variable
set "backupDir=C:\PathBackup"
set "xamppFolderPath=C:\XAMPP"
set "xamppPath=%mysqlPath%\php"
set "mysqlPath=%xamppFolderPath%\mysql\bin"
set "apachePath=%xamppFolderPath%\apache\bin"
set "perlPath=%xamppFolderPath%\perl\bin"
set "phpMyAdminPath=%xamppFolderPath%\phpMyAdmin"

:: Check for administrative privileges
>nul 2>&1 net session
if %errorLevel% NEQ 0 (
    echo Warning: This script requires administrative privileges to modify the PATH variable.
    echo Please run the script as an administrator.
	echo/
	echo Press any key to exit...
    pause>nul
    exit /b 1
)

:startup
cls
echo Welcome to the XAMPP Environment Setup Script
echo created by @glenkusuma
echo Version 1.0
echo/
echo 1. Add XAMPP to PATH
echo 2. Verify XAMPP PATH
echo 3. Exit
echo/
set /p choice=Enter your choice (1/2/3): 

if "%choice%"=="1" goto add_xampp
if "%choice%"=="2" goto verify
if "%choice%"=="3" goto end

:add_xampp
cls
echo Checking if xampp is installed in %xamppFolderPath% ....
echo/
if exist %xamppFolderPath% (
    echo   XAMPP is installed.
) else (
    echo Error: XAMPP is not installed.
    echo Press any key to exit...
    pause>nul
    exit /b 1
)

call :run_backup

echo/
echo Adding XAMPP to PATH...

echo/
set new_xampp=
call :add_xampp_php
echo/
call :add_xampp_mysql
echo/
call :add_xampp_apache
echo/
call :add_xampp_perl
echo/
call:add_xampp_phpmyadmin
echo/
echo Press any key to continue...
pause >nul
goto :startup

:add_xampp_php
echo   Checking XAMPP PHP...
call :get_path
call :checkpath %xamppPath%
if %errorlevel%==0 (
    echo   XAMPP PHP is already in PATH.
) else (
    echo   XAMPP PHP has been added to PATH.
    call :add_to_path %xamppPath%
)
goto :eof

:add_xampp_mysql
:: Check if XAMPP MySQL is in PATH
echo   Checking XAMPP MySQL...
call :get_path
call :checkpath %mysqlPath%
if %errorlevel%==0 (
    echo   XAMPP MySQL is already in PATH.
) else (
    echo   adding XAMPP MySQL to PATH.
    call :add_to_path %mysqlPath%
)
goto :eof

:add_xampp_apache
:: Check if XAMPP Apache is in PATH
echo   Checking XAMPP Apache...
call :get_path
call :checkpath %apachePath%
if %errorlevel%==0 (
    echo   XAMPP Apache is already in PATH.
) else (
    echo   adding XAMPP Apache to PATH.
    call :add_to_path %apachePath%
)
goto :eof

:add_xampp_perl
:: Check if XAMPP Perl is in PATH
echo   Checking XAMPP Perl...
call :get_path
call :checkpath %perlPath%
if %errorlevel%==0 (
    echo   XAMPP Perl is already in PATH.
) else (
    echo   adding XAMPP Perl to PATH.
    call :add_to_path %perlPath%
)
goto :eof

:add_xampp_phpmyadmin
:: Check if XAMPP phpMyAdmin is in PATH
echo   Checking XAMPP phpMyAdmin...
call :checkpath %phpMyAdminPath%
if %errorlevel%==0 (
    echo   XAMPP phpMyAdmin is already in PATH.
) else (
    echo adding XAMPP phpMyAdmin to PATH.
    call :add_to_path %phpMyAdminPath%
)
goto :eof

:verify
cls
call :get_path
echo   Checking XAMPP PHP...
call :checkpath %xamppPath% true
echo/
call :get_path
echo   Checking XAMPP MySQL...
call :checkpath %mysqlPath% true
echo/
call :get_path
echo   Checking XAMPP Apache...
call :checkpath %apachePath% true
echo/
call :get_path
echo   Checking XAMPP Perl...
call :checkpath %perlPath% true
echo/
call :get_path
echo   Checking XAMPP phpMyAdmin...
call :checkpath %phpMyAdminPath% true
echo/ 
call :get_path
echo Press any key to continue...
pause >nul
goto :startup

:: Function to check if a path exists in the PATH variable
:checkPath
call :get_path
echo %currentPath% | findstr /i /c:%~1 >nul
if errorlevel 1 (
    if "%~2"=="true" (
        echo   X  %~1 NOT IN the PATH.
    )
) else (
    if "%~2"=="true" (
        echo   V  %~1 has been added to PATH.
    )
)
goto :eof

:add_to_path
set "newPath=!currentPath!%~1;"
reg add "HKEY_CURRENT_USER\Environment" /v PATH /t REG_EXPAND_SZ /d "!newPath!" /f 
goto :eof

:get_path
for /f "tokens=2,*" %%A in (
    'reg query "HKEY_CURRENT_USER\Environment" /v PATH ^| find "PATH"'
) do (
    set "currentPath=%%B"
)
if not defined currentPath (
    echo Error: Could not retrieve the current PATH variable from the Windows Registry.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
goto :eof

:get_datetime
set hour=%time:~0,2%
if "%hour:~0,1%" == " " set hour=0%hour:~1,1%
set min=%time:~3,2%
if "%min:~0,1%" == " " set min=0%min:~1,1%
set secs=%time:~6,2%
if "%secs:~0,1%" == " " set secs=0%secs:~1,1%
set year=%date:~-4%
set month=%date:~3,2%
set day=%date:~0,2%
if "%day:~0,1%" == " " set day=0%day:~1,1%
set datetimef=%year%%month%%day%_%hour%%min%%secs%
goto :eof

:run_backup
echo Backing up registery...
:: Ensure the backup directory exists, create if not
if not exist "!backupDir!" (
    echo   Creating %backupDir% ...
    mkdir "!backupDir!")

if %errorLevel% NEQ 0 (
    echo   Error: Failed to Create the %backupDir% !
    pause
    exit /b 1
)

echo\
:: Set the backup file path and name with a timestamp
call :get_datetime
set "backupFile=!backupDir!\!datetimef!_system_path_backup.reg"

:: Export the current system PATH to the backup file
reg export "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "!backupFile!" /y

:: Check if the export was successful
if %errorLevel% NEQ 0 (
    echo Error: Failed to export the PATH variable.
    pause
    exit /b 1
)
echo/
echo   The system PATH variable has been successfully backed up to:
echo   "!backupFile!"
echo/
:: Set the backup file path and name with a timestamp
call :get_datetime
set   "backupFile=!backupDir!\!datetimef!_user_path_backup.reg"

:: Export the current PATH to the backup file
reg export "HKEY_CURRENT_USER\Environment" "!backupFile!" /y

:: Check if the export was successful
if %errorLevel% NEQ 0 (
    echo Error: Failed to export the PATH variable.
    pause
    exit /b 1
)
echo/
echo   The user PATH variable has been successfully backed up to:
echo   "!backupFile!"
echo/
goto :eof

:end
echo/
echo Press any key to exit...
pause >nul
exit /b 0