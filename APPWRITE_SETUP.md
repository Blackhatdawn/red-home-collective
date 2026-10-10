# Red Home Appwrite setup
Appwrite owns sign-in (Account), data (TablesDB, database 6ac98d8e0039b4e82213) and files (bucket `documents`).

1. Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID. Add the preview and published domains as Web platforms.
2. Enable Row security on every table and File security on the bucket.
3. Give admins the Appwrite label `admin`. Table permissions:
   - profiles, properties: read `label:admin`; rows readable by their owner.
   - deposits, sales, ledger_entries, milestones: create + read `label:admin` only (no update/delete on ledger_entries).
   - documents: create `users`, read `label:admin`.
   - audit_log: create + read `label:admin`; never grant update/delete.
   - bucket documents: create `users`, read `label:admin`.
4. Expected columns: every table has `userId`. profiles: email (no role column). properties: title, location, price, status. deposits: amount, currency, status. sales: propertyId, price, status. ledger_entries: amount, type, description. milestones: title, dueDate, status. documents: fileId, name, status. audit_log: action, targetUserId, details.
5. Roles: read only from the signed-in user's Appwrite labels (`admin`, `agent`, or none = user). Set labels in the Appwrite Console; the app never writes a role. The dashboard role guard is navigation only; the permissions above are the security boundary.
