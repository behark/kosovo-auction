import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

/**
 * Custom hook for tracking page views and events
 * This is a placeholder implementation - in a real app, you would
 * integrate with Google Analytics, Plausible, or another analytics provider
 */
export function useAnalytics() {
  const router = useRouter();

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // In a real app, this would send data to your analytics provider
      console.log(`Page view: ${url}`);
      
      // Example Google Analytics implementation (would require gtag setup)
      // window.gtag('config', 'GA-TRACKING-ID', {
      //   page_path: url,
      // });

      // Example Plausible implementation
      // const { pathname } = new URL(url, window.location.origin);
      // window.plausible('pageview', { props: { path: pathname } });
    };

    // Track initial page load
    handleRouteChange(router.asPath);

    // Track subsequent route changes
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Function to track custom events
  const trackEvent = ({ category, action, label, value }: AnalyticsEvent) => {
    // In a real app, this would send event data to your analytics provider
    console.log(`Event: ${category} / ${action} / ${label || ''} / ${value || ''}`);
    
    // Example Google Analytics implementation
    // window.gtag('event', action, {
    //   event_category: category,
    //   event_label: label,
    //   value: value,
    // });

    // Example Plausible implementation
    // window.plausible(action, {
    //   props: {
    //     category,
    //     label,
    //     value
    //   }
    // });
  };

  return { trackEvent };
}

export default useAnalytics;
