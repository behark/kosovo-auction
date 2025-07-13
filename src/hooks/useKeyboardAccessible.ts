import { KeyboardEvent, MouseEvent } from 'react';

/**
 * A custom hook that provides keyboard accessibility helpers
 * for interactive elements that aren't native buttons or links
 * 
 * This helps meet WCAG 2.1 Success Criterion 2.1.1 and 2.1.3
 */
export function useKeyboardAccessible() {
  /**
   * Handles keyboard events for non-button/link elements to make them keyboard accessible
   * Use this with onKeyDown for div/span elements acting as buttons
   * 
   * @param callback - Function to call when the element is activated
   * @returns Event handler for onKeyDown
   */
  const handleKeyDown = (callback: (event: KeyboardEvent | MouseEvent) => void) => {
    return (event: KeyboardEvent) => {
      // Trigger on Space or Enter key
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent scrolling on Space
        callback(event);
      }
    };
  };

  /**
   * Creates props for any element to make it keyboard accessible
   * 
   * @param callback - Function to call when the element is activated
   * @param ariaRole - ARIA role for the element (default: 'button')
   * @returns Props to spread on the element
   */
  const getAccessibleProps = (
    callback: (event: KeyboardEvent | MouseEvent) => void,
    ariaRole: string = 'button'
  ) => {
    return {
      role: ariaRole,
      tabIndex: 0,
      onClick: callback,
      onKeyDown: handleKeyDown(callback),
    };
  };

  return {
    handleKeyDown,
    getAccessibleProps,
  };
}

export default useKeyboardAccessible;
