import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useSmartBack() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathStackRef = useRef<string[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const stack = pathStackRef.current;
    const lastPath = stack[stack.length - 1];

    if (currentPath !== lastPath) {
      stack.push(currentPath);
    }
  }, [location.pathname]);

  const smartBack = () => {
    const stack = pathStackRef.current;
    const currentPath = location.pathname;

    // Remove current path
    while (stack.length > 0 && stack[stack.length - 1] === currentPath) {
      stack.pop();
    }

    // Go back to previous path
    const targetPath = stack.pop();
    if (targetPath) {
      navigate(targetPath);
    } else {
      navigate(-1); // fallback
    }
  };

  return smartBack;
}
