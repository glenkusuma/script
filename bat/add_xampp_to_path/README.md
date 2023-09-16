# add_xampp_to_path.bat

This script is for adding windows XAMPP to PATH using `reg add` command in windows.

## Requirements

 This script require **Administrative Privilages** to run in order to add the XAMPP to PATH in `HKEY_CURRENT_USER\Environment` using the `reg add` command.

## Adding XAMPP to PATH

1. Download the [add_xampp_to_path.bat](https://github.com/glenkusuma/script/blob/main/bat/add_xampp_to_path/add_XAMPP_to_PATH.bat) raw file.
2. Run the add_xampp_to_path.bat file with **Administrative Privilages**.
3. Select `Add XAMPP to PATH` in *startup menu* by pressing `1` then `ENTER` The script will done the following:
   - Checking XAMPP is installed in `C:\XAMPP`.
   - Create PATH registery backup file in `C:\BackupPath`.
   - Adding the XAMPP to PATH.
4. Select `Verify XAMPP PATH` in *startup menu* by pressing `2` then `ENTER` to verify if XAMPP has been added to PATH.
5. Select `Exit` *startup menu* by pressing `3` then `ENTER` to shutdown the script.

## About

This Script is created with ❤️ by [Glen Kusuma](https://github.com/glenkusuma).
