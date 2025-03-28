import Link from 'next/link';
import { formatDate } from '../utils/formatters';
import { useState } from 'react';

const MatchesSection = ({ title, matches, isLive, isCompleted }) => {
  const [showMore, setShowMore] = useState(false);

  const handleToggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <section className="mb-8">
      <div className='flex flex-row justify-between items-center mb-4'>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      {matches.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, showMore ? matches.length : 6).map((fixture) => {
              const getTeamScore = (teamId) => {
                const innings = fixture.Innings?.filter(inning => inning.BattingTeamId === teamId) || [];
                return innings.map(inning => `${inning.RunsScored}/${inning.NumberOfWicketsFallen} (${inning.OversBowled} ov)`) || [];
              };

              const homeTeamScores = getTeamScore(fixture.HomeTeam.Id);
              const awayTeamScores = getTeamScore(fixture.AwayTeam.Id);

              return (
                <Link key={fixture.Id} href={`/matches/${fixture.Id}`} className="group">
                  <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 group-hover:shadow-lg transition-shadow duration-300 cursor-pointer h-80">
                    <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-100">
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {fixture.Name ? `${fixture.Name} · ${fixture.Competition?.Name}` : fixture.Competition?.Name}
                      </p>
                      {isLive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          LIVE
                        </span>
                      )}
                      {isCompleted && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Completed
                        </span>
                      )}
                      {!isCompleted && !isLive && (
                        <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Upcoming
                        </span>
                      )}
                    </div>

                    {/* Match Details */}
                    <div className="flex flex-col text-black p-4 h-full">
                      <div className="flex flex-col space-y-4 flex-grow">
                        {/* Home Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={fixture.HomeTeam.LogoUrl}
                              alt={`${fixture.HomeTeam.Name} logo`}
                              className="h-10 w-10 rounded-full object-contain border"
                            />
                            <span className="text-lg font-medium">{fixture.HomeTeam?.ShortName || "TBA"}</span>
                          </div>
                          <div className="text-xl font-bold">
                            {homeTeamScores.map((score, index) => (
                              <div key={index} className={index === 0 ? 'text-gray-400' : 'text-black'}>
                                {score}
                              </div> 
                            ))}
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={fixture.AwayTeam.LogoUrl}
                              alt={`${fixture.AwayTeam.Name} logo`}
                              className="h-10 w-10 rounded-full object-contain border"
                            />
                            <span className="text-lg font-medium">{fixture.AwayTeam?.ShortName || "TBA"}</span>
                          </div>
                          <div className="text-xl font-bold">
                            {awayTeamScores.map((score, index) => (
                              <div key={index} className={index === 0 ? 'text-gray-400' : ''}>
                                {score}
                              </div> // First score has a lighter color
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Match Info */}
                      <div className="text-sm text-gray-600 space-y-2 mb-3">
                        <div className="flex justify-center font-semibold">
                          <p>{fixture.ResultText}</p>
                        </div>

                        <div className="flex space-x-2">
                          <p className='font-extrabold'>{fixture.GameType}</p>
                          {fixture.MatchDay !== 0 && fixture.MatchDay && (
                            <p>Match Day: {fixture.MatchDay}</p>
                          )}
                        </div>

                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(fixture.StartDateTime)}
                        </div>

                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {fixture.Venue?.Name || "Venue TBA"}, {fixture.Venue?.City || "City TBA"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {matches.length > 6 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleToggleShowMore}
                className="text-blue-500 hover:underline"
              >
                {showMore ? "Show Less" : "Show More..."}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-600">⚠️ No matches available.</div>
      )}
    </section>
  );
};

export default MatchesSection;
