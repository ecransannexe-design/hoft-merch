# HOFT Merchandising — Build Guide

Complete instructions for building and deploying to TestFlight (iOS) and Google Play (Android).

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | bundled with Node |
| Xcode | ≥ 15 | Mac App Store (iOS only) |
| Android Studio | ≥ 2023 | https://developer.android.com/studio |
| CocoaPods | ≥ 1.14 | `sudo gem install cocoapods` (iOS only) |
| Java (JDK) | 17 | bundled with Android Studio |

---

## 1 — First-time setup

```bash
cd hoft-app
npm install

# Add native platforms (one-time)
npx cap add ios
npx cap add android
```

---

## 2 — App icon & splash screen

Put your artwork in `resources/`:

| File | Size | Purpose |
|------|------|---------|
| `resources/icon.png` | 1024 × 1024 px | App icon (no transparency) |
| `resources/icon-foreground.png` | 1024 × 1024 px | Android adaptive icon foreground |
| `resources/icon-background.png` | 1024 × 1024 px | Android adaptive icon background |
| `resources/splash.png` | 2732 × 2732 px | Splash screen (centered logo) |
| `resources/splash-dark.png` | 2732 × 2732 px | Dark-mode splash (optional) |

Then generate all sizes:

```bash
npm run icons
# Runs: npx @capacitor/assets generate
```

This writes the correctly-sized assets into `ios/` and `android/` automatically.

---

## 3 — Build & sync

```bash
# Build the web bundle + sync to both native projects
npm run cap:sync
# equivalent to: npm run build && npx cap sync
```

---

## 4 — iOS / TestFlight

### Open in Xcode
```bash
npx cap open ios
```

### Required Info.plist entries
Capacitor adds these when you run `npm install` + `cap sync`, but verify they exist in
**ios/App/App/Info.plist**:

```xml
<key>NSCameraUsageDescription</key>
<string>HOFT needs camera access to photograph store displays.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>HOFT needs photo library access to attach images to visit reports.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>HOFT saves photos to your library.</string>
```

### Privacy Manifest (iOS 17+ / required for App Store)
Create **ios/App/App/PrivacyInfo.xcprivacy** with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key><false/>
  <key>NSPrivacyCollectedDataTypes</key><array/>
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array><string>CA92.1</string></array>
    </dict>
  </array>
</dict>
</plist>
```

### Configure signing
1. In Xcode → **Signing & Capabilities** → select your team
2. Set **Bundle Identifier** to `com.hoft.merchandising`
3. Set **Version** and **Build** numbers

### Upload to TestFlight
1. Product → **Archive**
2. Distribute App → **App Store Connect** → Upload
3. In App Store Connect → TestFlight → add testers

---

## 5 — Android / Google Play

### Open in Android Studio
```bash
npx cap open android
```

### Permissions
Capacitor writes these automatically. Confirm in
**android/app/src/main/AndroidManifest.xml**:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Configure app ID
In **android/app/build.gradle**:
```groovy
defaultConfig {
    applicationId "com.hoft.merchandising"
    minSdkVersion 22
    targetSdkVersion 34
    versionCode 1
    versionName "1.0.0"
}
```

### Build release APK / AAB
```bash
# In Android Studio: Build → Generate Signed Bundle / APK
# Choose Android App Bundle (AAB) for Google Play
```

Or via CLI (requires a keystore):
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Upload to Google Play
1. Create app in [Google Play Console](https://play.google.com/console)
2. Upload the `.aab` to Internal Testing → promote to Production

---

## 6 — Development workflow

```bash
# Web dev server (hot reload)
npm run dev

# Build + sync + open Xcode
npm run cap:ios

# Build + sync + open Android Studio
npm run cap:android

# Just sync (after code changes, no Xcode/AS open)
npm run cap:sync
```

### Live reload on device (iOS)
```bash
npx cap run ios --livereload --external
```

### Live reload on device (Android)
```bash
npx cap run android --livereload --external
```

---

## 7 — Adding a backend / upload endpoint

The photo queue (`src/hooks/usePhotoQueue.ts`) is wired for offline-first storage.
To connect a real backend, register your upload function in `src/App.tsx`:

```ts
const { setUploadFn, flush } = usePhotoQueue()

useEffect(() => {
  setUploadFn(async (photo) => {
    const res = await fetch('https://api.your-backend.com/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: photo.storeId,
        rep: photo.rep,
        type: photo.type,
        image: photo.dataUrl,
        capturedAt: photo.capturedAt,
      }),
    })
    if (!res.ok) throw new Error('Upload failed')
  })
}, [setUploadFn])

// Call flush() when the app regains connectivity:
// App.addListener('resume', flush)
```

---

## 8 — Project structure

```
hoft-app/
├── src/
│   ├── App.tsx                    Root component, all visit state
│   ├── main.tsx                   React entry point
│   ├── components/
│   │   ├── SplashScreen.tsx       Login: WHO / WHERE pickers
│   │   ├── AppHeader.tsx          Wordmark + rep/store strip
│   │   ├── FolderAccordion.tsx    5-folder collapse animation
│   │   ├── PickerSheet.tsx        Bottom-sheet picker
│   │   ├── PhotoTile.tsx          Round / rect photo capture tile
│   │   └── folders/
│   │       ├── InfoFolder.tsx     YTD stats + CONGRATS/WHY verdict
│   │       ├── StartFolder.tsx    6 arrival-photo circles
│   │       ├── ChecklistFolder.tsx YES toggles + missing SKUs
│   │       ├── PicturesFolder.tsx  After-photos grid
│   │       └── CompleteFolder.tsx  Summary + COMPLETE VISIT
│   ├── hooks/
│   │   ├── usePhotoQueue.ts       Offline-first photo upload queue
│   │   └── useSafeArea.ts         Dynamic Island / notch insets
│   ├── lib/
│   │   ├── camera.ts              Capacitor Camera + web fallback
│   │   └── storage.ts             @capacitor/preferences wrapper
│   ├── data/stores.ts             Reps, stores, SKUs, checklist
│   ├── types/index.ts             Shared TypeScript types
│   └── styles/
│       ├── global.css             Resets, .screen helper
│       ├── tokens.css             CSS custom properties
│       └── fonts.css              @font-face declarations
├── public/
│   ├── fonts/                     Self-hosted Larsseit + Queens Compressed
│   ├── assets/                    hoft-logo.png, hoft-wordmark.png
│   └── manifest.json              PWA manifest
├── resources/                     Icon + splash source artwork (you supply)
├── capacitor.config.ts
├── vite.config.ts
├── package.json
└── BUILD.md                       This file
```

---

## 9 — Known limitations / next steps

- **No backend** — photos queue locally; wire `setUploadFn` to your API (see §7)
- **No auth** — rep selection is a local picker; add JWT/OAuth before production
- **Queens Compressed** is a trial font — purchase a production licence from Latinotype before App Store submission
- **Lora** is loaded from Google Fonts CDN — bundle it locally for offline use
