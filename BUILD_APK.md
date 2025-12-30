# FitFlow APK Build Guide

## Overview
This guide explains how to convert the FitFlow Python fitness app into an Android APK that can be installed on any Android device.

## Files Included
- `fitflow_combined.py` - Core fitness tracking logic
- `main.py` - Kivy-based mobile UI
- `buildozer.spec` - Buildozer configuration for APK building
- `requirements.txt` - Python dependencies

## Prerequisites

### For macOS (Testing/Development):
1. **Python 3.9+** - Already installed
2. **Kivy** - GUI framework for mobile
3. **Buildozer** - APK build tool
4. **Cython** - Performance optimization
5. **Android SDK** - For actual APK compilation (requires separate setup)

### For Linux (Recommended for APK building):
Ubuntu/Debian is recommended for building APKs as it has better Android toolchain support.

## Step-by-Step Instructions

### Step 1: Install Dependencies
```bash
pip3 install buildozer cython kivy requests
```

### Step 2: Test on Desktop (macOS)
```bash
cd "/Users/MAC/Desktop/FitFlow app"
python3 main.py
```

This will launch the Kivy app in a desktop window for testing.

### Step 3: Prepare for APK Build

#### Option A: Build on macOS (Limited)
```bash
cd "/Users/MAC/Desktop/FitFlow app"
buildozer macosx debug
```

#### Option B: Build on Linux (Recommended)
1. Install Ubuntu/Debian or use WSL on Windows
2. Copy the FitFlow folder to Linux system
3. Install dependencies:
```bash
sudo apt-get update
sudo apt-get install -y build-essential git python3 python3-pip openjdk-11-jdk android-sdk android-ndk
pip3 install buildozer cython kivy
```

### Step 4: Configure buildozer.spec
The `buildozer.spec` file is already configured with:
- App name: FitFlow
- Package name: org.fitflow.fitflow
- Android API: 31 (with API 21 minimum support)
- Required permissions: INTERNET, NETWORK_ACCESS, STORAGE
- Architecture: arm64-v8a (64-bit) and armeabi-v7a (32-bit)

### Step 5: Build the APK

#### On Linux:
```bash
cd "/path/to/FitFlow app"
buildozer android debug
```

This will:
1. Download Android SDK, NDK, and required tools (~2GB)
2. Compile Python to C using Cython
3. Build the APK (~50-100 minutes)
4. Generate: `bin/fitflow-0.1-debug.apk`

#### For Production Release (Signed APK):
```bash
buildozer android release
```

This creates an unsigned APK. To sign it:
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.jks \
  bin/fitflow-0.1-release-unsigned.apk \
  fitflow
```

### Step 6: Install on Android Device

#### Via USB Cable:
```bash
adb install bin/fitflow-0.1-debug.apk
```

#### Via APK File Transfer:
1. Transfer APK to Android device
2. Open file manager and tap the APK
3. Allow installation from unknown sources if needed
4. Tap "Install"

## Troubleshooting

### Issue: "buildozer: command not found"
**Solution:**
```bash
export PATH="$HOME/Library/Python/3.9/bin:$PATH"
buildozer --version
```

### Issue: "Android SDK not found"
**Solution:**
Set environment variables:
```bash
export ANDROID_SDK_ROOT=/path/to/android-sdk
export ANDROID_NDK_ROOT=/path/to/android-ndk
```

### Issue: Build fails on macOS
**Reason:** macOS has limited Android build support
**Solution:** Use Linux or WSL for building

### Issue: APK too large
**Solution:** Remove unused dependencies or use ProGuard for code shrinking

## App Features

The FitFlow app includes:

### Dashboard
- Overall fitness score
- Water intake tracking
- Sleep tracking
- Step counter
- Calorie tracking
- Protein intake

### Nutrition
- Meal logging
- Calorie calculator
- Macro breakdown (protein, carbs, fat)
- Nutrition insights
- Food database search

### Workouts
- Workout plan management
- Exercise logging
- Rep/set tracking
- Progress monitoring

### Community
- Social feed
- Post sharing
- Anonymous posting
- Engagement metrics

### Settings
- User profile management
- Posture and symmetry scoring
- Workout intensity adjustment
- Data export

## File Structure
```
FitFlow app/
├── fitflow_combined.py      # Core logic (31 functions)
├── main.py                  # Kivy GUI wrapper
├── buildozer.spec           # Build configuration
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Build Output

After successful build:
- **Debug APK:** `bin/fitflow-0.1-debug.apk`
- **Build logs:** `.buildozer/android/platform/build-<arch>/<app_name>/build/outputs/`

APK file size: ~40-60 MB (depending on optimizations)

## Performance Optimization

To improve app performance:
1. Use ProGuard for Java code shrinking
2. Enable PyInstaller optimization in buildozer
3. Reduce included libraries
4. Use Cython compilation for Python modules

## Next Steps

1. Test the app on desktop: `python3 main.py`
2. Review `buildozer.spec` for your specific needs
3. Install build tools (Java, Android SDK/NDK)
4. Build APK: `buildozer android debug`
5. Test on Android device or emulator
6. Create production release when ready

## Support

For issues with:
- **Buildozer:** https://buildozer.readthedocs.io/
- **Kivy:** https://kivy.org/doc/stable/
- **Android:** https://developer.android.com/

## License
FitFlow - Fitness Tracking Application
