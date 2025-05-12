
import { useState, useEffect } from "react";
export function useLocalStorageState(key, initialValue) {
    const [value, setValue] = useState(function () {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : initialValue;
    });

     useEffect(
        function () {
          localStorage.setItem(key, JSON.stringify(value));
        },
        [value]
      );
      return [value, setValue];
}