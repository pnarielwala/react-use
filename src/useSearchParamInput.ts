import { useState, useEffect } from 'react';

function supportsHistory() {
  return (typeof window === 'object') && (typeof URLSearchParams === 'function');
}

function useSearchParamInput(
  key: string,
  defaultValue?: string | null,
  options?: {
    onUpdate?: (newPath: string) => {};
  }
): [string | null, (value: string) => void] {
  const onUpdate = options && options.onUpdate;

  const { pathname, search } = window.location;

  let params = new URLSearchParams(search);
  const [value, setValue] = useState<string | null>(defaultValue ?? params.get(key));

  useEffect(() => {
    params = new URLSearchParams(search);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (onUpdate) {
      onUpdate(`${pathname}?${params}`);
    } else if (supportsHistory()) {
      window.history.replaceState({}, '', `${pathname}?${params}`);
    }
  }, [pathname, value, key, search, onUpdate]);

  return [value, setValue];
}

export default useSearchParamInput;
