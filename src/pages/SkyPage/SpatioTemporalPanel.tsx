import { useState, useRef, useCallback, useEffect } from 'react';
import { IMMERSIVE_THEME } from '@/theme/immersive';

export interface City {
  n: string;
  py: string;
  lat: number;
  lon: number;
  prov: string;
}

interface Props {
  cities: City[];
  onApply: (city: City, dateTime: string) => void;
  isOpen: boolean;
  onClose: () => void;
  initialCity: City;
  initialDateTime: string;
}

export function SpatioTemporalPanel({
  cities, onApply, isOpen, onClose, initialCity, initialDateTime,
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedTime, setSelectedTime] = useState(initialDateTime);
  const [selectedCity, setSelectedCity] = useState<City>(initialCity);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = cities.filter(c =>
    c.n.includes(query) || c.py.includes(query.toLowerCase())
  ).slice(0, 30);

  const handleApply = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onApply(selectedCity, selectedTime);
      onClose();
    }, IMMERSIVE_THEME.duration.debounceMs);
  }, [selectedCity, selectedTime, onApply, onClose]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    setSelectedCity(initialCity);
    setSelectedTime(initialDateTime);
  }, [initialCity, initialDateTime]);

  return (
    <div className={`panel-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className={`panel-content ${isOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: 0, fontSize: 18, color: IMMERSIVE_THEME.colors.primaryCyan }}>切换时空</h3>
        <input
          type="text" placeholder="搜索城市 (如: 济南 / jinan)"
          value={query} onChange={e => setQuery(e.target.value)}
          className="hud-input"
        />
        <div className="city-list-container">
          {filtered.length === 0 ? (
            <div style={{ padding: 12, color: IMMERSIVE_THEME.colors.textDim, textAlign: 'center', fontSize: 12 }}>未找到</div>
          ) : filtered.map(city => (
            <div key={city.n} onClick={() => { setSelectedCity(city); setQuery(''); }}
              className={`city-item ${selectedCity.n === city.n ? 'active' : ''}`}>
              {city.n} <span style={{ fontSize: 12, opacity: 0.6 }}>({city.prov})</span>
            </div>
          ))}
        </div>
        <label style={{ fontSize: 12, color: IMMERSIVE_THEME.colors.textDim }}>
          观测时间
          <input type="datetime-local" value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            className="hud-input" style={{ marginTop: 4 }} />
        </label>
        <button onClick={handleApply} className="hud-btn-primary">应用时空</button>
      </div>
    </div>
  );
}
