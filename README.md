# Firebase CRUD

A React Native app for creating, viewing, editing, and deleting student records in
Cloud Firestore. The app listens for changes to the `students` collection in
real time.

## What you need

- Node.js 22.11.0 or later and npm
- A development environment for React Native:
  - **Android:** Android Studio, Android SDK, and an emulator or USB-connected
    Android device
  - **iOS:** macOS, Xcode, and CocoaPods
- A Firebase account and a Firebase project

Follow the official [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment)
for the full platform-specific requirements.

## 1. Create and configure the Firebase project

1. Open the [Firebase Console](https://console.firebase.google.com/) and select
   **Add project**. Follow the prompts to create a project.
2. From the project overview, add an app for each platform you plan to run:
   - **Android:** Set the Android package name to **`com.firebasecrud`**. This
     must match the app's `applicationId` in `android/app/build.gradle`.
   - **iOS:** Register the iOS bundle ID used by the Xcode project. The current
     Xcode project resolves this to
     `org.reactjs.native.example.FirebaseCRUD`; you can confirm or change it in
     Xcode under the app target's **Signing & Capabilities** settings.
3. Download the platform configuration file:
   - **Android:** Place `google-services.json` at
     `android/app/google-services.json`. A file is already present in this
     checkout; replace it with the file for your own Firebase project if needed.
   - **iOS:** Download `GoogleService-Info.plist` and add it to the
     `ios/FirebaseCRUD` Xcode project. In Xcode, select **Copy items if needed**
     and ensure the app target is checked. This checkout does not currently
     include an iOS Firebase configuration file.
4. In the Firebase Console, open **Build → Firestore Database** and select
   **Create database**. Choose a location and create the database.
5. Configure Firestore security rules before using the app. The app currently
   has no sign-in flow, so rules that require an authenticated user will block
   its reads and writes. Do not leave broad public read/write rules in
   production; add authentication and appropriately restrictive rules before
   deploying a publicly accessible app.

The app uses the native Firebase SDK through `@react-native-firebase/app` and
`@react-native-firebase/firestore`; it does not use a JavaScript
`initializeApp()` call.

## 2. Install dependencies

From the project directory, install the locked dependencies:

```sh
npm ci
```

## 3. Run the app

### Android

Start an Android emulator or connect a device with USB debugging enabled. In
one terminal, start Metro:

```sh
npm start
```

In a second terminal from the project directory, build and launch the app:

```sh
npm run android
```

#### Clean and build with Gradle

If you need to clean Android build outputs or build the Android project
directly, run these commands from the project root in PowerShell:

```powershell
cd android
.\gradlew.bat clean
```

To build all configured Android build tasks after cleaning:

```powershell
.\gradlew.bat build
```

To build and install the debug app on a connected device or running emulator:

```powershell
.\gradlew.bat installDebug
```

Return to the project root before running npm commands:

```powershell
cd ..
```

### iOS

iOS builds require macOS and the iOS Firebase configuration file described
above. Install CocoaPods dependencies, then start Metro and launch the app:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm start
```

In a second terminal:

```sh
npm run ios
```

## Using the app

Enter a student's name, age, and course, then select **Add Student**. Saved
records appear in **Student List** and update in real time.

- **Edit:** Select **Edit** on a student, change the form values, then select
  **Update Student**. Select **Cancel Edit** to discard the edit.
- **Delete:** Select **Delete** on a student and confirm the action.

Each document in the Firestore `students` collection has these fields:

| Field | Type |
| --- | --- |
| `name` | String |
| `age` | Number |
| `course` | String |

## Project commands

| Command | Description |
| --- | --- |
| `npm start` | Start the Metro development server |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `cd android; .\gradlew.bat clean` | Remove generated Android build outputs |
| `cd android; .\gradlew.bat build` | Build all configured Android tasks |
| `npm test` | Run the Jest test suite |
| `npm run lint` | Run ESLint |

## Troubleshooting

- **Android reports missing Firebase options:** Confirm the config file is at
  `android/app/google-services.json`, is from the intended Firebase project,
  and its Android package name is `com.firebasecrud`.
- **Firestore reports a permissions error:** Review the Firestore rules in the
  Firebase Console. The app currently does not authenticate users.
- **iOS cannot initialize Firebase:** Ensure `GoogleService-Info.plist` is
  added to the Xcode app target, then run `bundle exec pod install` from the
  `ios` directory and rebuild.
- **Metro or native build problems:** Stop and restart Metro, then consult the
  [React Native troubleshooting guide](https://reactnative.dev/docs/troubleshooting).
