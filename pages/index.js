import { useEffect, useState } from 'react';
import { formatDate } from './utils/formatters';
import MatchesSection from './components/matches';

const HomePage = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/views/fixtures?UpcomingFixturesCount=30&InProgressFixturesCount=30&CompletedFixturesCount=30');
        const data = await response.json();

        setLiveMatches(data.InProgressFixtures || []);
        setUpcomingMatches(data.UpcomingFixtures || []);
        setCompletedMatches(data.CompletedFixtures || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center">Loading matches...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 ">
      {liveMatches.length > 0 && (
        <MatchesSection title="Live Matches" matches={liveMatches} isLive={true} />
      )}
      <MatchesSection title="Upcoming Matches" matches={upcomingMatches} isLive={false} isCompleted={false} />
      <MatchesSection title="Completed Matches" matches={completedMatches} isLive={false} isCompleted={true} />
    </div>
  );
};

export default HomePage;
