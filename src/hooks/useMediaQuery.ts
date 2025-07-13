import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design - detects if the current viewport matches the provided media query
 * @param query CSS media query string (e.g., '(min-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null and update after mount to avoid hydration issues
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define event listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}

/**
 * Predefined breakpoints based on common device sizes
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

/**
 * Custom hook that returns an object with boolean values for each common breakpoint
 * @returns Object with boolean values for each breakpoint
 */
export function useBreakpoints() {
  const sm = useMediaQuery(breakpoints.sm);
  const md = useMediaQuery(breakpoints.md);
  const lg = useMediaQuery(breakpoints.lg);
  const xl = useMediaQuery(breakpoints.xl);
  const xxl = useMediaQuery(breakpoints['2xl']);
  
  return {
    sm,
    md,
    lg,
    xl,
    xxl,
    isMobile: !sm,
    isTablet: sm && !lg,
    isDesktop: lg,
  };
}

export default useMediaQuery;
