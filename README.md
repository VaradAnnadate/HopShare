# HopShare

HopShare is an Expo Go mobile app concept for ride-sharing and fare splitting. It helps people find nearby rides, share empty seats, and split the trip cost with others heading in the same direction. The repository currently starts from Expo's blank TypeScript template so you can build the app step by step.

## Current app

The app includes rider search and ride details, plus a driver form to post a ride with route, day, time, available passenger seats, driver name, and total fare. Posted rides appear in search during the current app session. Ride details show total fare, seat capacity, and the estimated share per passenger. Requesting a seat decrements availability and updates the list. All data is local in-memory demo state and resets when the app restarts; there is no payment, driver notification, or backend persistence.

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
3. Persist ride creation, matching, seat availability, and fare splitting with server-side validation.
4. Add trip chat, notifications, profile verification, and ride history.

Keep API keys and Firebase credentials out of source control. Configure provider restrictions and environment-specific settings before connecting live services.

## Current demo flow

- Edit the pickup and destination fields, choose Today or Tomorrow, and select the number of seats.
- Tap **Find rides** to filter the sample ride list.
- Tap a ride card to see route, driver, trip, and per-person fare details.
- Use **Offer a ride** to create a ride, then find it in the rider list during the same app session.
- Ride fares are split across the listed passenger seat capacity, rounding shares up to a whole rupee.
- Seat requests decrement available seats locally. The route preview is illustrative; no live map, payment, driver notification, or backend is configured.
