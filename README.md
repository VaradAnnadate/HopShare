# HopShare

HopShare is an Expo Go mobile app concept for ride-sharing and fare splitting. It helps people find nearby rides, share empty seats, and split the trip cost with others heading in the same direction.

## Current app

The starter app includes a polished ride discovery screen with sample Bengaluru trips, a route and time search card, per-person fare display, driver ratings and seats remaining, a simple join-seat interaction, and an **Offer a ride** view. The ride cards and savings are demo content stored locally in the app; there is no live matching, map, chat, authentication, or backend yet.

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
- Expo Router
- Expo Go for on-device development

## Project structure

```text
app/
  _layout.tsx    Root navigation layout
  index.tsx      HopShare ride discovery screen
app.json         Expo app configuration
```

## Next development steps

1. Add destination autocomplete and route previews with a map provider.
2. Add Firebase Authentication and a Firestore data model for users, rides, ride requests, and messages.
3. Implement ride creation, matching, seat availability, and fare splitting with server-side validation.
4. Add trip chat, notifications, profile verification, and ride history.

Keep API keys and Firebase credentials out of source control. Configure provider restrictions and environment-specific settings before connecting live services.

## Demo interactions

- Switch between **Find a ride** and **Offer a ride**.
- Tap **Join** on a ride to see the sample seat-request confirmation.
- Search, profile, and bottom navigation controls currently show placeholder messages.
