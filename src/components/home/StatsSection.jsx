import { useState, useEffect } from 'react';
import StatsBanner from '../common/StatsBanner';
import { getStats } from '../../services/homeService';
import '../../css/stats-section.css';

const FALLBACK_STATS = [
  { value: '20', suffix: '+', label: 'Clients Served' },
  { value: '11', suffix: 'K+', label: 'Employees' },
  { value: '4',  suffix: '+', label: 'Years of Experience' },
];

export default function StatsSection() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    getStats()
      .then((res) => {
        const rows = (res.data || []).filter((s) => s.context === 'home');
        if (rows.length) setStats(rows);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="stats-section">
      <StatsBanner stats={stats} />
    </div>
  );
}
