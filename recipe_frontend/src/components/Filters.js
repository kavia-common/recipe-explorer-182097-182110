import { CUISINE_OPTIONS, SORT_OPTIONS } from '../utils/constants';
import { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Filters for cuisine, tags and sort.
 */
export function Filters({ onChange }) {
  const [cuisine, setCuisine] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  const emit = (next = {}) => {
    const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    onChange?.({ cuisine, tags, sort, ...next });
  };

  return (
    <div className="section">
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label className="small text-muted">Cuisine</label>
          <select className="select" value={cuisine}
            onChange={(e) => { setCuisine(e.target.value); emit({ cuisine: e.target.value }); }}>
            <option value="">All</option>
            {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="small text-muted">Tags (comma separated)</label>
          <input
            className="input"
            placeholder="e.g. vegan, quick"
            value={tagsText}
            onChange={(e) => { setTagsText(e.target.value); emit({}); }}
          />
        </div>
        <div>
          <label className="small text-muted">Sort</label>
          <select className="select" value={sort}
            onChange={(e) => { setSort(e.target.value); emit({ sort: e.target.value }); }}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
