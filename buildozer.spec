[app]

# (str) Title of your application
title = FitFlow

# (str) Package name
package.name = fitflow

# (str) Package domain (needed for android/ios packaging)
package.domain = org.fitflow

# (source.dir) Source code where the main.py live
source.dir = .

# (list) Source files to include (let empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas,json

# (list) List of inclusions using pattern matching
#source.include_patterns = assets/*,images/*.png

# (list) Source files to exclude (let empty to not exclude anything)
#source.exclude_exts = spec

# (list) List of directory to exclude (let empty to not exclude anything)
#source.exclude_dirs = tests, bin, venv

# (list) List of exclusions using pattern matching
#source.exclude_patterns = license,images/*/*.jpg

# (str) Application versioning (method 1)
version = 0.1

# (str) Application versioning (method 2)
# version.filename = %(source.dir)s/version.txt

# (list) Application requirements
# comma separated e.g. requirements = sqlite3,kivy
requirements = python3,kivy,requests,android

# (str) Supported orientation (landscape, portrait or all)
orientation = portrait

# (bool) Indicate if the application should be fullscreen or not
fullscreen = 0

# (string) Presplash of the application (image or text+image)
# presplash.filename = %(source.dir)s/data/presplash.png

# (list) Permissions
android.permissions = INTERNET,ACCESS_NETWORK_STATE,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE

# (int) Target Android API, should be as high as possible.
android.api = 31

# (int) Minimum API your APK will support.
android.minapi = 21

# (str) Android NDK version to use
#android.ndk = 25b

# (bool) Use legacy toolchain, set to False to use the new toolchain
android.use_legacy_toolchain = False

# (bool) Enable AndroidX support
android.enable_androidx = True

# (str) Android logcat filters to use
#android.logcat_filters = *:S python:D

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs_src = 0

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
android.archs = arm64-v8a,armeabi-v7a

# (bool) Enable AndroidX support. If False, Kivy will compile a stub
android.enable_androidx = True

# (list) Pattern to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) Path to a custom whitelist file
#android.whitelist_src = ./whitelist.txt

# (str) Path to a custom blacklist file
#android.blacklist_src = ./blacklist.txt

# (list) List of Java files for adding java code to the APK
#android.add_src =

# (list) Pattern to whitelist the use of the world writable app cache directory
# default is simply 'privateCache'
# android.add_permissions_uses_feature =

# (str) XML string for custom backup rules (see the documentation)
# android.backup_rules =

# (str) XML string for custom restore rules (see the documentation)
# android.restore_rules =

# (str) XML string for custom backup agent class (see the documentation)
# android.backup_agent_class =

# Python for android (p4a) specific

# (bool) python-for-android dependency to use cython
#p4a.use_cython = False

# (str) python-for-android branch to use, defaults to master
p4a.branch = develop

# (str) OUYA Console icon. It must be a 732x412 png image.
#android.ouya_icon_filename = %(source.dir)s/data/ouya_icon.png

# (str) OUYA Console category. Should be one of GAME or APP
# If you leave this blank, OUYA support will be disabled.
android.ouya_category = APP

# (str) Filename of OUYA Console icon. It must be a 732x412 png image.
#android.ouya_icon_filename = %(source.dir)s/data/ouya_icon.png

# (str) XML string to include as an intent-filter in your Activity
# android.activity_intent_filters = 

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs_src = 0

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
android.archs = arm64-v8a

# (bool) enables Android auto backup feature (Android API >=23)
android.allow_backup = True

# (str) XML string for custom backup rules (see the documentation)
# android.backup_rules =

# (str) If you need to insert java code inside the MCActivity class, define it here.
# the base set of the domain, plus a random string
#android.meta_data = 

# (str) Filename of OUYA Console icon. It must be a 732x412 png image.
#android.ouya_icon_filename = %(source.dir)s/data/ouya_icon.png

# (str) XML string to include as an intent-filter in your Activity
# android.activity_intent_filters = 

# (list) patterns to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) python-for-android release to use
# p4a.release = 2020.03.06

# (int) port number to specify an explicit --port= p4a argument (eg for bootstrap flask)
# p4a.port = 5000

[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warnings for every profile (0 = error only, 1 = info, 2 = debug)
warn_on_root = 1

# (str) Path to build artifact storage, absolute or relative to spec file
# build_dir = ./.buildozer

# (str) Path to build output (i.e. .apk, .aab) storage
# bin_dir = ./bin
