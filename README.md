# Recipe App

A simple and convenient recipe management app built with Next.js and Firebase. Search recipes, filter by various parameters, create your own recipes, and save favorites.

## Tech Stack

- **Next.js 15.5** (App Router)
- **React 19** with Suspense
- **Firebase**:
  - Authentication (Email/Password + Google)
  - Firestore Database
  - Storage (for recipe images)
- **Tailwind CSS 4** for styling
- **TypeScript** for type safety

## Features

- User authentication with email/password or Google Sign-In
- Search recipes by title, description, ingredients, and cuisine
- Filter by category, prep time, and cuisine
- Detailed recipe pages with ingredients and instructions
- Create, edit, and delete recipes
- Save recipes to favorites
- Fully responsive design

## Prerequisites

Required:

- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **npm or yarn** — comes with Node.js
- **Firebase project** — [Firebase Console](https://console.firebase.google.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd recipe-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

Create a new project in [Firebase Console](https://console.firebase.google.com/) and enable:

- **Authentication** → Email/Password + Google provider
- **Firestore Database** → Production mode (or test mode for development)
- **Storage** → Default rules for file uploads

### 4. Get Firebase configuration

1. Navigate to Project Settings → General → Your apps
2. Add a web app or copy configuration from existing app
3. Copy configuration values

### 5. Create environment variables file

Create `.env.local` file in the project root with Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. Run the development server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Firebase Security Rules (Optional)

Security rules for production:

### Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recipe-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}


## Implementation Details

**Search and Filtering:**
- Search uses Firestore queries with `startAt`/`endAt` for prefix matching on titles
- Additional client-side filtering for partial matches in description, ingredients, and cuisine
- Filters use Firestore `where` clauses for category, prep time, and cuisine
- Custom time range uses Firestore `>=` and `<=` operators
- Multiple filters can be combined dynamically

**Pagination:**
- Implemented using Firestore cursor-based pagination with `startAfter`
- Loads 12 recipes per page directly from Firestore
- Each page requires a separate Firestore query for optimal performance

**Recipe Management:**
- CRUD operations fully integrated with Firestore
- Image uploads to Firebase Storage
- Automatic cleanup of storage files when recipes are deleted

**Authentication:**
- Email/password authentication
- Google Sign-In integration
- Protected routes using Next.js middleware
- User data stored in Firestore `users` collection
```
