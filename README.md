# HopShare

HopShare is an Expo Go mobile app concept for ride-sharing and fare splitting. It helps people find nearby rides, share empty seats, and split the trip cost with others heading in the same direction. The repository currently starts from Expo's blank TypeScript template so you can build the app step by step.

## Current app

The app includes rider search and ride details, a driver ride-posting form, fare splitting, and seat requests. Ride details include an Expo Go map with approximate Bengaluru pickup/drop-off markers and a straight-line route preview. Firebase email/password authentication and Firestore ride syncing are included but require project configuration. Without Firebase credentials, the app stays in local demo mode.

## Run with Expo Go

1. Install [Node.js LTS](https://nodejs.org/) and the Expo Go app on your iOS or Android phone.
2. From this project directory, install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx expo start
   ```

4. Scan the QR code shown in the terminal with Expo Go. Your phone and computer should be on the same network. If local network discovery is blocked, run `npx expo start --tunnel` instead.

You can also use `npm start`, `npm run ios`, `npm run android`, or `npm run web`.

## Tech stack

- React Native and Expo
- TypeScript
- Expo blank TypeScript template
- Expo Go for on-device development

## Project structure

```text
App.tsx          Main application component
app.json         Expo app configuration
firebase.ts      Optional Firebase Auth and Firestore setup
firestore.rules  Starter Firestore access rules
```

## Enable Firebase

1. Create a Firebase project and register a **Web app** to get its Firebase configuration values.
2. In Firebase Authentication, enable the **Email/Password** provider.
3. Create a Firestore database.
4. Copy `.env.example` to `.env` and fill in the values from your Firebase Web app configuration. The `.env` file is ignored by Git.
5. Publish the rules in `firestore.rules` to the project's Firestore database.
6. Restart Expo with `npx expo start --clear`.

The signed-in app listens to the `rides` collection, saves posted rides there, and decrements cloud ride seat counts in a Firestore transaction. Sample rides remain local demo examples. Firebase's client configuration is included in the app bundle; enforce access through Firebase Authentication and Firestore rules, and never put service account credentials in the app.

## Next development steps

1. Add destination autocomplete and real route previews with a map provider.
2. Add Firebase Authentication and a Firestore data model for users, rides, ride requests, and messages.
3. Persist ride creation, matching, seat availability, and fare splitting with server-side validation.
4. Add trip chat, notifications, profile verification, and ride history.

Keep API keys and Firebase credentials out of source control. Configure provider restrictions and environment-specific settings before connecting live services.

## Current demo flow

- Edit the pickup and destination fields, choose Today or Tomorrow, and select the number of seats.
- Tap **Find rides** to filter the sample ride list.
- Tap a ride card to see route, driver, trip, and per-person fare details.
- Open the profile icon to create an account or sign in. Without Firebase setup, the screen explains the configuration needed.
- Use **Offer a ride** to create a ride, then find it in the rider list. Signed-in rides sync through Firestore; demo rides stay local.
- Ride fares are split across the listed passenger seat capacity, rounding shares up to a whole rupee.
- Seat requests decrement available seats locally in demo mode and transactionally in Firestore for cloud rides.
- The map displays approximate neighborhood coordinates and a straight line, not turn-by-turn directions. No payment or driver notification is configured.
