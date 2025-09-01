# Next.js Template with Redux, React Query, and Analytics Integration

This project is a Next.js template that provides a robust foundation for building modern web applications with integrated state management, data fetching, and analytics tracking.

The template incorporates Redux for state management, React Query for efficient data fetching, and integrates various analytics services including Posthog, Google Analytics, and Facebook Pixel. It also includes a customizable component library and utility functions for common tasks.

## Repository Structure

```
.
├── src
│   ├── api
│   │   ├── auth.js
│   │   └── interceptor.js
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── signin
│   │       └── page.js
│   ├── components
│   │   ├── common
│   │   │   ├── Button.jsx
│   │   │   ├── description
│   │   │   └── heading
│   │   ├── sections
│   │   │   └── HeaderAndButton.jsx
│   │   └── SEO.jsx
│   ├── constants
│   │   └── constant.js
│   ├── hooks
│   │   └── useMutationHandler.js
│   ├── store
│   │   ├── hooks.js
│   │   ├── reduxProvider.js
│   │   ├── slices
│   │   │   └── userSlice.js
│   │   └── store.js
│   └── utils
│       ├── analytics.js
│       └── Providers.js
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tailwind.config.js
```

### Key Files:
- `src/app/layout.js`: Root layout component for the Next.js application
- `src/api/interceptor.js`: Axios instance with interceptors for API calls
- `src/utils/analytics.js`: Analytics integration utilities
- `src/components/SEO.jsx`: SEO component for managing meta tags
- `src/store/store.js`: Redux store configuration
- `src/utils/Providers.js`: Provider components for Redux and React Query

### Important Integration Points:
- Redux store: `src/store/store.js`
- React Query client: `src/utils/Providers.js`
- API interceptor: `src/api/interceptor.js`
- Analytics tracking: `src/utils/analytics.js`

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14 or later)
- npm (v6 or later)

Steps:
1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

### Getting Started

1. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   BASE_URL=your_api_base_url
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser to see the application

### Configuration Options

- Tailwind CSS: Customize the `tailwind.config.js` file to adjust the theme
- Next.js: Modify `next.config.mjs` for Next.js specific configurations
- Redux: Add or modify slices in `src/store/slices` directory

### Common Use Cases

1. Adding a new API endpoint:
   - Add the endpoint to `src/constants/constant.js`
   - Create a new function in `src/api/auth.js` or a new file in the `api` directory

2. Creating a new page:
   - Add a new file in `src/app` directory, e.g., `src/app/newpage/page.js`

3. Adding analytics tracking:
   - Use the `trackAnalytics` function from `src/utils/analytics.js`:
     ```javascript
     import { trackAnalytics } from '../utils/analytics';

     trackAnalytics('event_name', { property1: 'value1' });
     ```

### Integration Patterns

1. Using Redux:
   - Import hooks from `src/store/hooks.js`:
     ```javascript
     import { useAppDispatch, useAppSelector } from '../store/hooks';
     ```

2. Making API calls:
   - Import the API instance from `src/api/interceptor.js`:
     ```javascript
     import api from '../api/interceptor';

     const fetchData = async () => {
       const response = await api.get('/endpoint');
       // Handle response
     };
     ```

3. Using React Query:
   - Wrap your component with `QueryClientProvider` in `src/utils/Providers.js`
   - Use React Query hooks in your components

### Testing & Quality

- Run linter: `npm run lint`
- Add unit tests in `__tests__` directory (to be implemented)

### Troubleshooting

1. Issue: API calls failing
   - Check if `BASE_URL` is correctly set in `.env.local`
   - Ensure the API server is running and accessible
   - Check browser console for CORS errors

2. Issue: Redux state not updating
   - Verify that the correct action is being dispatched
   - Check if the reducer is handling the action correctly
   - Use Redux DevTools to inspect state changes

3. Issue: Analytics not tracking
   - Ensure all required environment variables are set
   - Check browser console for any errors related to analytics services
   - Verify that the analytics services are properly initialized in `src/utils/analytics.js`

### Debugging

- Enable debug mode for Posthog:
  ```javascript
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    debug: true
  });
  ```
- Use browser developer tools to inspect network requests and console logs
- For Redux debugging, install Redux DevTools browser extension

### Performance Optimization

- Use the `@next/bundle-analyzer` to identify large dependencies:
  ```
  npm run build
  ```
  Note: During the build process, a window will open automatically to show the bundle analysis. This helps you visualize the size and composition of your application's JavaScript bundles.
- Implement code splitting using Next.js dynamic imports
- Optimize images using Next.js Image component
- Implement caching strategies with React Query

## Data Flow

The application follows a typical React-Redux-Query data flow:

1. User interacts with the UI
2. Action is dispatched (Redux) or query/mutation is triggered (React Query)
3. API call is made through the interceptor (`src/api/interceptor.js`)
4. Response is received and processed
5. State is updated (Redux store or React Query cache)
6. Components re-render with new data

```
[User Interaction] -> [Redux Action / React Query] -> [API Interceptor] -> [Backend API]
                                                                               |
[UI Update] <- [Component Re-render] <- [State Update] <- [Response Processing] <-
```

Notes:
- Redux is used for global application state
- React Query is used for server state management and caching
- Analytics events are tracked at various points in this flow using `src/utils/analytics.js`