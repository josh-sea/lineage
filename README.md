# TowerPro - Cooling Tower Inspection Management System

A comprehensive web application for managing cooling tower inspections, built with React and Firebase.

## Features

- **User Authentication**: Secure Firebase authentication system
- **Inspection Reports**: Create, edit, and view detailed cooling tower inspection reports
- **Inspector Management**: Manage inspector profiles and assignments
- **Multi-step Report Creation**: Streamlined workflow for creating inspection reports including:
  - Site Information
  - Tower Information
  - Chemical Treatment
  - Conductivity Controller
  - Records on Site
  - Photo Uploads
  - Review & Submit
- **Dashboard**: Overview of all inspection reports and system status
- **Print Functionality**: Print-ready report views

## Technology Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: CSS
- **Build Tool**: Create React App

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone https://github.com/josh-sea/lineage.git
cd lineage
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Development

Run the app in development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Production

### Build for Production

Create an optimized production build:
```bash
npm run build
```

### Start Production Server

Run the production server (uses Node.js server):
```bash
npm start
```

## Firebase Deployment

This app is configured for Firebase Hosting deployment.

### Initial Setup

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (if not already done):
```bash
firebase init
```

### Deploy to Firebase

Deploy the application to Firebase Hosting:
```bash
npm run build
firebase deploy
```

Or use the shorthand:
```bash
firebase deploy --only hosting
```

## Project Structure

```
lineage/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── auth/       # Authentication components
│   │   ├── dashboard/  # Dashboard components
│   │   ├── inspectors/ # Inspector management
│   │   ├── layout/     # Layout components (Navbar, PrivateRoute)
│   │   └── report/     # Report creation and viewing
│   ├── contexts/       # React contexts (AuthContext)
│   ├── firebase.js     # Firebase configuration
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── server.js           # Production server
└── package.json        # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please contact the development team or open an issue in the repository.
