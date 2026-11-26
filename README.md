# HopShare

HopShare is an Expo Go mobile app concept for ride-sharing and fare splitting. It helps people find nearby rides, share empty seats, and split the trip cost with others heading in the same direction. The repository currently starts from Expo's blank TypeScript template so you can build the app step by step.

## Current app

The app includes the first rider search flow: editable pickup and destination, Today/Tomorrow selection, seat count controls, locally filtered sample rides, and a ride detail screen with driver information, route preview, trip estimates, and per-passenger fare. Search data is local demo content; the route preview is illustrative, and seat requests are not connected to a backend yet.

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
```

## Next development steps

1. Add destination autocomplete and real route previews with a map provider.
2. Add Firebase Authentication and a Firestore data model for users, rides, ride requests, and messages.
3. Implement ride creation, persistent matching, seat availability, and fare splitting with server-side validation.
4. Add trip chat, notifications, profile verification, and ride history.

Keep API keys and Firebase credentials out of source control. Configure provider restrictions and environment-specific settings before connecting live services.

## Current demo flow

- Edit the pickup and destination fields, choose Today or Tomorrow, and select the number of seats.
- Tap **Find rides** to filter the sample ride list.
- Tap a ride card to see route, driver, trip, and per-person fare details.
- The map preview and seat request confirmation are placeholders; no live map, booking, or backend is configured.
