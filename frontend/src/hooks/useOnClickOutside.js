import { useEffect } from 'react';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    console.log(ref)
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
