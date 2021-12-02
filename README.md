# QR Scanner!

A very simple QR scanner made with React Native and Expo.

#### Requirements:

- An Android/iOS device with the `Expo Go` app installed.
- Working Camera

## Environment setup

### 1. Clone the repo

### 2. Install Expo globally and configure env variables

     npm install --global expo-cli

#### Create a file called `.env` inside the project's root.

#### Download and copy the content of `env.txt` (from here: https://drive.google.com/file/d/13exHK5t6CJSnKuvfisroI9PQH_ofXzZ9/view?usp=sharing) into the `.env` file created in the last step.

#### Replace the `HOST` environment variable with your local machine's private IP address

### 3. Start the mock-server

     cd simple-qr-scanner
     node web.jsx

#### You should see this string in your terminal: `Listening on 5000`

### 4. Start the Expo app

#### 4.1 Local (the mock-server should be up and running)

     expo start

#### This will start a `expo-server` instance with the app running in: `http://localhost:19002/` and will generate a QR, scan this QR with any camera app and it wil open in Expo Go.

#### You can test the scanner with the QR codes inside the `QR` folder!

#### 4.2 Generate bundle files

     expo eject

#### This will generate a minified file: `dist/app.config.js` that you can import as a single JS file through CDN.