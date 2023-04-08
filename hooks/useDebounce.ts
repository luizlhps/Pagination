import { useCallback, useRef } from "react";

export const useDebounse = (delay = 800) => {
  const debouseDelay = useRef<NodeJS.Timeout>();
  const isFirstTime = useRef(true);

  const debouse = useCallback(
    (func: () => void) => {
      if (isFirstTime.current) {
        isFirstTime.current = false;
        console.log("salve");
        func();
      } else {
        if (debouseDelay.current) {
          clearTimeout(debouseDelay.current);
        }
        debouseDelay.current = setTimeout(() => func(), delay);
      }
    },
    [delay],
  );

  return { debouse };
};
