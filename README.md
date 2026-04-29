# DS-Contact-Map
Map Application used by sales team to create list of customers to visit out in the field.

# Architecture
React Web App wrapped by capacitor to create native app for TestFlight

# Tech
Mapbox - map UI, geocoding contact adresses
Hubspot - read/write contact data, read/write lists

# Capacitor/Vite App
npm create vite@latest dockstar-salesrep-map -- --template react
cd dockstar-salesrep-map
npm install @capacitor/core
npm install -D capacitor/cli
npx cap init
npm install @capacitor/ios
npx cap add ios
npm run build
npx cap sync ios
npx cap open ios