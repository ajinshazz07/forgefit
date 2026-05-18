# **App Name**: ForgeFit

## Core Features:

- Federated Health Profile: Secure user onboarding via Firebase Authentication with support for Google and phone OTP login.
- AI Fitness Strategy: A generative model that acts as a tool to draft bespoke meal plans and exercise routines tailored to the user's BMI classification and goal track.
- Interactive BMI Matrix: A precise interface for users to input height, weight, and age, providing immediate visualization of health metrics.
- Resilient Workout Sync: Local-first workout logging with rep counting that pushes updates to Cloud Firestore once an internet connection is established.
- The Vault Gear Shop: A curated grid of gym equipment fetched directly from Firestore with seamless card-based interactions and basket management.
- Health Progress Ledger: Historical tracking of BMI scores and exercise sessions stored in a Cloud Firestore collection for cross-device consistency.

## Style Guidelines:

- Primary Color: Candy Apple Red (#F20D0D), a vibrant and energetic red that serves as the high-impact visual driver for action buttons and accents.
- Background Color: Onyx Noir (#0F0D0D), a deeply desaturated near-black derived from the primary hue to provide a premium, castle-like atmosphere.
- Accent Color: Electric Magenta (#F24099), providing sharp contrast against the red and black for non-primary interactive elements.
- Headlines: 'Playfair' serif for a sophisticated, high-end editorial feel. Body Text: 'Inter' sans-serif for machined precision and legibility.
- Minimalist duotone icons featuring thin white lines and red 'glow' highlights to mirror a dark-mode command center.
- A masonry grid layout using cards with 12px rounded corners and subtle drop shadows for depth and material separation.
- Fluid spring transitions between the BMI input stage and the AI-generated results to provide a premium, bespoke feel.