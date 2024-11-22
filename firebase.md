
This repository appears to be configured for use with Firebase, likely hosting a backend service using Firebase Hosting and other Firebase services like Firestore, Authentication, and Storage. Here’s how you can set up and install this backend:

1. Prerequisites
Ensure you have the following tools installed on your machine:

Node.js (recommended LTS version)
Firebase CLI (npm install -g firebase-tools)
2. Clone the Repository

```sh
git clone https://github.com/Stuka-Labs/XLFC-Back.git
cd XLFC-Back
git checkout jredmond/fixing-auth
```

```sh
npm install
```
This installs all necessary dependencies.

4. Login to Firebase
Log in to Firebase CLI to gain access to the associated Firebase project:

```sh
firebase login
```
5. Set Up Firebase Project
If this repository has already been connected to a Firebase project, the settings should be in the firebase.json file.

Check the firebase.json file to confirm which Firebase project is linked. If not linked:
```sh
firebase init
```
During the setup:
Choose relevant Firebase features (Hosting, Firestore, Functions, etc.).
Link or create a Firebase project.
6. Deploy Firebase Rules and Configurations
The repository contains Firebase rules and configurations you need to deploy.

a. Deploy Firestore Rules
Deploy Firestore security rules and indexes:

```sh
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```
b. Deploy Storage Rules
Deploy Cloud Storage security rules:

```sh
firebase deploy --only storage
```
c. Deploy Remote Config
If the repository uses Firebase Remote Config, deploy it:

```sh
firebase deploy --only remoteconfig
```

d. Deploy Hosting
If you're setting up Firebase Hosting for the app:

```sh
firebase deploy --only hosting
```

7. Test Locally
You can run the Firebase Emulator Suite to test backend services locally:

```sh
firebase emulators:start
```

This allows you to simulate Firestore, Hosting, and other Firebase services on your local machine.
