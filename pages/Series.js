import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SDate } from './utils/formatters';
import SeriesDetails from './components/SeriesDetails';

const SeriesPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'api/competitions/format/year?limit=25&isUpcoming=true&year=2025'
        );
        setSeries(response.data.CompetitionDetails);

        const path = window.location.pathname;
        const match = path.match(/^\/Series\/(\d+)$/);
        
        if (match) {
          const competitionId = parseInt(match[1], 10);
          const competition = response.data.CompetitionDetails.find(
            (comp) => comp.CompetitionId === competitionId
          );
          setSelectedCompetition(competition || null);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();

    const handlePopState = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/Series\/(\d+)$/);
      if (match) {
        const competitionId = parseInt(match[1], 10);
        const competition = series.find((comp) => comp.CompetitionId === competitionId);
        setSelectedCompetition(competition || null);
      } else {
        setSelectedCompetition(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleSelectCompetition = (competition) => {
    window.history.pushState({}, '', `/Series/${competition.CompetitionId}`);
    setSelectedCompetition(competition); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Categorize series
  const liveSeries = series.filter((competition) => competition.IsInprogress);
  const upcomingSeries = series.filter((competition) => competition.IsUpcoming);
  const completedSeries = series.filter((competition) => competition.IsCompleted);

  const displayLimit = 6;

  if (selectedCompetition) {
    console.log("selectedCompetition", selectedCompetition);
    
    return <SeriesDetails competition={selectedCompetition} />;
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">ALL SERIES</h1>

      {/* Live Series */}
      {liveSeries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Live Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveSeries.slice(0, showMore ? liveSeries.length : displayLimit).map((competition) => (
              <SeriesCard
                key={competition.CompetitionId}
                competition={competition}
                onSelect={() => handleSelectCompetition(competition)} // Pass competition on click
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Series */}
      {upcomingSeries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Upcoming Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSeries.slice(0, showMore ? upcomingSeries.length : displayLimit).map((competition) => (
              <SeriesCard
                key={competition.CompetitionId}
                competition={competition}
                onSelect={() => handleSelectCompetition(competition)} // Pass competition on click
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Series */}
      {completedSeries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Completed Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSeries.slice(0, showMore ? completedSeries.length : displayLimit).map((competition) => (
              <SeriesCard
                key={competition.CompetitionId}
                competition={competition}
                onSelect={() => handleSelectCompetition(competition)} // Pass competition on click
              />
            ))}
          </div>
        </div>
      )}

      {/* Show More Button */}
      {(liveSeries.length > displayLimit || upcomingSeries.length > displayLimit || completedSeries.length > displayLimit) && (
        <div className="flex justify-end mt-4">
          <button onClick={handleToggleShowMore} className="text-blue-500 hover:underline">
            {showMore ? 'Show Less' : 'Show More...'}
          </button>
        </div>
      )}
    </div>
  );
};

const SeriesCard = ({ competition, onSelect }) => {
  return (
    <div
      className="bg-white p-4 rounded-2xl shadow-md overflow-hidden border border-gray-200 cursor-pointer"
      onClick={onSelect} 
    >
      <div className="flex flex-rowh-full">
        <div className="flex-1">
          <div className="flex flex-row items-center space-x-2">
            <h4 className="text-sm font-semibold mb-2 flex-1"> 
              {competition.Formats.map((format, index) => (
                <span
                  key={index}
                  className={format.Name.length > 0 ? 'bg-blue-500 text-white px-2 py-1 rounded-md mr-1' : ''}
                >
                  {format.Name}
                </span>
              ))}
            </h4>
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">{competition.Name}</h2>

        </div>

        <div className="ml-4 mt-4">
          <img src={competition.LogoUrl} alt={`${competition.Name} Logo`} className="w-20 h-20" />
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm">{SDate(competition.StartDateTime)} - {SDate(competition.EndDateTime)}</p>
      </div>
    </div>
  );
};



export default SeriesPage;
