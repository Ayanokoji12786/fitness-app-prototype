#!/bin/bash

# FitFlow APK Build Quick Start Script

echo "========================================="
echo "   FitFlow - APK Builder"
echo "========================================="
echo ""

# Check for buildozer
if ! command -v buildozer &> /dev/null; then
    echo "⚠️  Buildozer not found. Installing..."
    export PATH="$HOME/Library/Python/3.9/bin:$PATH"
    pip3 install buildozer cython kivy requests
fi

# Menu
echo "Select build option:"
echo "1) Test app on Desktop (macOS)"
echo "2) Build APK (requires Linux/WSL with Android SDK)"
echo "3) View build configuration"
echo "4) Clean build artifacts"
echo ""
read -p "Enter option (1-4): " choice

case $choice in
    1)
        echo "Starting desktop test..."
        python3 main.py
        ;;
    2)
        echo "Building APK..."
        echo "Note: This requires Linux/WSL with Android SDK installed"
        echo "See BUILD_APK.md for detailed instructions"
        buildozer android debug
        if [ $? -eq 0 ]; then
            echo "✓ APK built successfully!"
            echo "Location: bin/fitflow-0.1-debug.apk"
        else
            echo "✗ Build failed. Check build output above."
        fi
        ;;
    3)
        echo "Buildozer configuration:"
        grep -E "^(title|package|version|requirements|android\.permissions|android\.api)" buildozer.spec
        ;;
    4)
        echo "Cleaning build artifacts..."
        rm -rf .buildozer bin
        echo "✓ Cleaned"
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "For detailed information, see BUILD_APK.md"
