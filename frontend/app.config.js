import 'dotenv/config';

export default {
  expo: {
    name: "MyFirstApp",
    slug: "MyFirstApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      firebaseApiKey: "AIzaSyDab5hMh4fVNF3if_EZTO6trWx_5k_qRxQ",
      firebaseAuthDomain: "sip-cl-37c93.firebaseapp.com",
      firebaseProjectId: "sip-cl-37c93",
      firebaseStorageBucket: "sip-cl-37c93.appspot.com",
      firebaseMessagingSenderId: "868336523690",
      firebaseAppId: "1:868336523690:ios:8ffe2dff10f2a1614133d3"
    }
  }
};
