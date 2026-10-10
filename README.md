# Red Home Collective

Build "Red Home", a global real estate platform for private individuals.

DESIGN: Premium, editorial look like Airbnb/Compass/Sotheby's. Palette: deep red #B3202A as accent only, warm off-white #FAF8F5 background, charcoal #1C1C1E text. Headings in a serif (Playfair Display), body in Inter. Generous whitespace, large property photography, 12px rounded cards, subtle shadows, smooth hover transitions. No purple gradients, no emoji icons, no generic hero blobs. Use lucide icons. Fully responsive.

PAGES: Home (hero with search, featured listings, how it works, trust section, footer), Listings with filters, Property detail, Login/Register.

AUTH: Firebase Auth with three roles: admin, agent, user. Store role in Firestore and enforce it with route guards and security rules. Each role gets its own dashboard layout with sidebar navigation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/628f5518-a323-4e0c-ad14-f4052d09082a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
