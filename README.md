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

# Logic
Can filter by contacts owned by user or all users.
Admin ability: can filter by all contacts are chosen salesmen contacts
    need to impliment
Use hubspot filter groups for lifecycle stage and lead status 
The returned list gets filtered client side for location
If any contacts can't get geocoded, they get dropped
    need to create way to view those

login url: https://ds-contact-map.onrender.com/auth/login