# Red Home Firebase setup
Firebase, rather than Lovable Cloud, owns application authentication and roles.

1. Create a Firebase web application and enable Email/Password in Authentication. Create Firestore.
2. Supply the public web configuration as VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID in the deployment environment. Firebase web API keys are public configuration, not admin credentials.
3. Add the preview and published domains to Firebase Authentication authorized domains.
4. Deploy firestore.rules with Firebase CLI: firebase deploy --only firestore:rules --project YOUR_PROJECT_ID. Rules are supplied here but are not deployed automatically.
5. Register the first user, then use the trusted Firebase Console to set roles/{uid}.role to admin. Subsequent agent/admin assignments require an administrator under the security rules. Never let a signup form select an elevated role.

Signups create only a user role, with no additional profile fields. Dashboards verify the Firebase session and read the role from Firestore before rendering; database rules enforce access independently. Missing configuration or unreadable roles fail closed. No demo login or local role overrides.

The public property collection is an illustrative bundled catalog. Publishing, inquiries and moderation services are not connected. Signed-in favorites use Firestore. Test role isolation and rules with the Firebase Emulator before deploying a production database.
