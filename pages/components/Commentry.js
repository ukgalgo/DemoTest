import React, { useEffect, useState } from "react";

const Commentary = ({ Id, homeTeam, awayTeam }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentry, setCommentry] = useState(null);
  const [inningNumber, setInningNumber] = useState(1);

  const fetchCommentary = async (inning) => {
    if (!Id) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/views/comments?FixtureId=${Id}&inningNumber=${inning}&overLimit=500`);
      if (!response.ok) throw new Error("No commentary available at the moment");

      const data = await response.json();
      setCommentry(data);
    } catch (err) {
      console.error("Error fetching match details:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentary(inningNumber);
  }, [Id, inningNumber]);

  const getBattingTeamName = (battingTeamId) => {
    if (!homeTeam || !awayTeam) return "Unknown Team";
    if (battingTeamId === homeTeam.Id) {
      return homeTeam.ShortName || "Home Team";
    } else if (battingTeamId === awayTeam.Id) {
      return awayTeam.ShortName || "Away Team";
    } else {
      return "Unknown Team";
    }
  };

  const availableInnings = commentry?.Innings || [];
  const maxInnings = availableInnings.length;

  return (
    <div>
      <h2 className="text-lg font-bold">Commentary</h2>
      <div className="h-0.5 bg-gray-500 mb-2 w-full"></div>
      
      <div className="mb-4">
        {Array.from({ length: maxInnings }, (_, index) => {
          const inning = availableInnings[index];
          const battingTeamId = inning?.BattingTeamId; 
          const teamName = getBattingTeamName(battingTeamId);

          return (
            <button 
              key={index + 1} 
              onClick={() => setInningNumber(index + 1)} 
              className={`mr-2 p-2 ${inningNumber === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {`${teamName}`}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p>Loading commentary...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !commentry || !commentry.Innings || commentry.Innings.length === 0 ? (
        <p>No commentary available at the moment.</p>
      ) : (
        <div>
          {commentry.Innings.map((inning, inningIndex) => (
            <div key={inningIndex}>
              {inning.Overs && inning.Overs.length > 0 ? (
                inning.Overs.map((over, overIndex) => {
                  const overNumber = over.OverNumber;

                  return (
                    <div key={overIndex} className="mb-4">
                      <div>
                        <h2 className="font-bold">Over {over.OverNumber}</h2>
                        <p>{over.TotalRuns} RUNS, {over.Wickets} WICKET</p>
                      </div>
                      {over.Balls && over.Balls.length > 0 ? (
                        over.Balls.map((ball, ballIndex) => (
                          <div key={ballIndex} className="flex flex-row items-start mb-2 gap-6">
                            <div>
                              <h4 className="bg-blue-500 text-white rounded-full py-1 px-2 text-lg font-bold">
                                {ball.RunsScored}
                              </h4>
                              <p className="text-sm">{`${overNumber}.${ball.BallNumber}`}</p>
                            </div>
                            {ball.Comments && ball.Comments.length > 0 ? (
                              ball.Comments.map((comment, commentIndex) => (
                                <p key={commentIndex} className="border-l-4 border-blue-500 pl-4 py-1">
                                  {comment.Message}
                                </p>
                              ))
                            ) : null}
                          </div>
                        ))
                      ) : null}
                    </div>
                  );
                })
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Commentary;
