import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

let reactPixel;

const trackAnalytics = (eventName, eventProperties) => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, eventProperties);
    window.gtag("event", eventName, eventProperties);
  }
};

const identifyUser = (userId) => {
  if (typeof window !== "undefined") {
    posthog.identify(userId);
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      user_id: userId,
    });
  }
};

const setUserAttributes = (userProperties) => {
  if (typeof window !== "undefined") {
    const key_map = { ...userProperties };
    posthog.people.set(key_map);
    window.gtag("set", "user_properties", userProperties);
  }
};

const options = {
  autoConfig: true,
  debug: false,
};

const initFacebookPixel = (ReactPixel, pixelId) => {
  if (typeof window !== "undefined") {
    reactPixel = ReactPixel;
    ReactPixel.init(pixelId, undefined, options);
  }
};

const trackPageView = (ReactPixel) => {
  if (typeof window !== "undefined") {
    ReactPixel.pageView();
  }
};

const trackEvent = (event, params) => {
  if (typeof window !== "undefined") {
    reactPixel.track(event, params);
  }
};

export {
  trackAnalytics,
  identifyUser,
  setUserAttributes,
  initFacebookPixel,
  trackPageView,
  trackEvent,
};
