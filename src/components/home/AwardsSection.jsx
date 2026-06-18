import { useState, useEffect } from 'react';
import SectionHeading from '../common/SectionHeading';
import AwardsBadges from '../common/AwardsBadges';
import Loader from '../common/Loader';
import { getAwards } from '../../services/homeService';
import '../../css/awards-section.css';

export default function AwardsSection() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAwards()
      .then((res) => setAwards(res.data || []))
      .catch(() => setAwards([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !awards.length) return null;

  return (
    <section className="awards-section">
      <div className="awards-section__container">
        <SectionHeading
          eyebrow="Recognition"
          title="Industry-Leading Recognition"
          subtitle="Consistently recognised by global analyst firms and industry bodies for excellence in service delivery and innovation."
          center
          white
        />
        {loading ? <Loader /> : <AwardsBadges awards={awards} />}
      </div>
    </section>
  );
}
