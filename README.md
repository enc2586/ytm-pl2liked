# YouTube Music Auto Liker

[한국어](README.ko.md) | [English](README.md)

A browser script that automatically likes songs in YouTube Music playlists. This tool helps you migrate from other music platforms by automatically liking all songs in a playlist.

## ⚠️ DISCLAIMER

**This script is provided "AS IS" without warranty of any kind.**

**BY USING THIS SCRIPT, YOU ACKNOWLEDGE AND AGREE THAT:**

1. You use this script at **YOUR OWN RISK**
2. The author assumes **NO LIABILITY** for any damages, account suspensions, or other consequences
3. This may violate YouTube's Terms of Service
4. Your account may be temporarily or permanently suspended
5. You are solely responsible for any actions taken using this script

## 📋 Prerequisites

- A web browser (Chrome, Firefox, Safari, Edge)
- YouTube Music account
- A playlist you want to auto-like

## 🚀 Usage

### Step 1: Open Browser Console

1. **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
2. **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows/Linux) / `Cmd+Option+K` (Mac)
3. **Safari**: Enable Developer Menu in Preferences → Advanced, then press `Cmd+Option+C`

### Step 2: Navigate to Console Tab

Click on the "Console" tab in the developer tools that opened.

### Step 3: (Optional) Enable Paste Functionality

**Note**: This step is only needed if you encounter issues with pasting code in the console:

1. Type `allow pasting` in the console and press Enter
2. You should see a message confirming paste is enabled
3. If you see any other security-related prompts, follow the instructions

**Most users can skip this step** - try pasting the script directly first.

### Step 4: Copy and Paste the Script

1. Open the `index.js` file in this repository
2. Copy all the code
3. Paste it into the browser console
4. Press Enter to execute

### Step 5: Follow the Prompts

The script will guide you through:

- Accepting the disclaimer
- Loading your playlist
- Choosing processing order (normal or reverse)
- Setting delay between likes
- Final confirmation before starting

## ⚙️ Features

- **Smart Loading**: Automatically detects and loads all songs in a playlist
- **Flexible Order**: Process songs from top to bottom or bottom to top
- **Configurable Delay**: Set custom delays to avoid rate limiting
- **Progress Tracking**: Real-time progress bar with ETA
- **Error Handling**: Gracefully handles missing elements and errors
- **Status Updates**: Detailed logging of each action

## 🔧 Configuration

- **Delay**: Recommended 10-15 seconds for large playlists, minimum 5 seconds
- **Order**: Choose between normal (top to bottom) or reverse (bottom to top)
- **Scroll Padding**: Automatically adjusts to load all playlist content

## 📄 License

This project is licensed under the MIT License - see `LICENSE` for details.

## ⚠️ Important Notes

- **Use at your own risk** - This tool may violate YouTube's Terms of Service
- **Account suspension** is possible if used excessively or detected
- **Respect rate limits** - Use recommended delays to avoid triggering anti-bot measures
- **Personal use only** - Do not use for commercial purposes or mass automation
