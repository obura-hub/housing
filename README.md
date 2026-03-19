# Boma Yangu - Next.js Clone

A complete Next.js clone of the Boma Yangu Affordable Housing Program website (https://www.bomayangu.go.ke/).

## Features

- ✅ **Notice Modal** - Payment migration notice with localStorage persistence
- ✅ **Responsive Design** - Mobile-first design that works on all devices
- ✅ **Modern UI** - Built with Next.js 16, React 19, TypeScript, and Tailwind CSS
- ✅ **Multiple Pages** - Home, About, How It Works, Projects, Contact, Login, Register
- ✅ **SEO Optimized** - Proper meta tags and Open Graph support
- ✅ **Accessible** - ARIA labels and keyboard navigation support

## Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Inter (from Google Fonts)
- **React**: 19.2.3

## Project Structure

```
bomayangu-nextjs/
├── app/
│   ├── about/          # About page
│   ├── contact/        # Contact page
│   ├── how-it-works/   # How it works page
│   ├── login/          # Login page
│   ├── projects/       # Projects listing page
│   ├── register/       # Registration page
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer component
│   └── NoticeModal.tsx # Payment migration notice modal
├── public/
│   └── assets/         # SVG logos and images
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Pages

- **Home** (`/`) - Landing page with hero section, features, and CTA
- **About** (`/about`) - Information about Boma Yangu
- **How It Works** (`/how-it-works`) - Step-by-step guide
- **Projects** (`/projects`) - Available housing projects
- **Contact** (`/contact`) - Contact form and information
- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page

## Components

### NoticeModal
Displays the payment migration notice on first visit. Uses localStorage to remember if the user has closed it.

### Header
Responsive navigation header with mobile menu.

### Footer
Site footer with links and contact information.

## Styling

The project uses Tailwind CSS v4 with custom CSS variables for:
- Primary color: `#15B76C`
- Text colors
- Spacing and typography

## Assets

SVG logos are stored in `public/assets/`:
- `housing_state_department.svg`
- `boma-yangu-logo.svg`

## Development

### Key Features Implemented

1. **Notice Modal**
   - Appears on first visit
   - Closable with X button or Close button
   - Remembers closed state in localStorage
   - Keyboard accessible (Escape key)

2. **Responsive Navigation**
   - Desktop horizontal menu
   - Mobile hamburger menu
   - Smooth transitions

3. **Homepage Sections**
   - Hero section with CTA buttons
   - Features grid
   - How it works steps
   - Call-to-action section

4. **Form Pages**
   - Login form
   - Registration form
   - Contact form

## Customization

### Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary: #15B76C;
  --primary-dark: #0F854E;
  --primary-light: #36E895;
}
```

### Content
Edit page components in `app/[page]/page.tsx` files.

## License

This is a clone project for educational purposes.

## Notes

- The original website is a React/Vue SPA
- This clone focuses on replicating the UI/UX with Next.js
- Some functionality may need backend integration for full functionality
- SVG assets are included from the original site
