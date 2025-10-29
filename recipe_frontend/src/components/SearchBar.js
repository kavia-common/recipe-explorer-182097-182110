import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

/**
 * PUBLIC_INTERFACE
 * SearchBar with debounced onChange callback.
 */
export function SearchBar({ defaultValue = '', onChange, placeholder = 'Search recipes...' }) {
  const [value, setValue] = useState(defaultValue);

  const debounced = useMemo(() => debounce((v) => onChange?.(v), 300), [onChange]);

  useEffect(() => {
    debounced(value);
    return () => debounced.cancel();
  }, [value, debounced]);

  return (
    <div className="section" role="search">
      <div className="flex items-center gap-2">
        <span className="badge">⌘ <span className="kbd">K</span></span>
        <input
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Search"
        />
      </div>
    </div>
  );
}
