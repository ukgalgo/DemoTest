import React, { useState } from 'react';
import { useRouter } from 'next/router';

function Scorecard({ innings = [], players = [], homeTeam, awayTeam }) {
    const [currentInning, setCurrentInning] = useState(0); // State to track the current inning
    const [hoveredPlayerId, setHoveredPlayerId] = useState(null); // Track hovered player by ID

    const router = useRouter(); // Use Next.js router for navigation

    const handleInningChange = (index) => {
        setCurrentInning(index);
    };

    const handlePlayerClick = (playerId) => {
        router.push(`/players/${playerId}`); // Navigate to the player's page
    };

    // Check if there are no innings or players
    const noScorecardAvailable = innings.length === 0 || players.length === 0;

    // If no scorecard is available, show the message
    if (noScorecardAvailable) {
        return (
            <div className="p-5 bg-gray-100 rounded-lg shadow-md">
                <div className="text-red-500 text-center text-lg my-5">
                    Scorecard unavailable. <br />
                    There is currently no scorecard available.
                </div>
            </div>
        );
    }

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

    return (
        <div className="p-5 bg-gray-100 rounded-lg shadow-md text-black">
            <div className="text-center mb-5">
                {innings.length > 0 && (
                    <button
                        className={`px-4 py-2 mx-2 rounded ${currentInning === 0 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => handleInningChange(0)}
                    >
                        {innings[0]?.BattingTeamId ? getBattingTeamName(innings[0].BattingTeamId) : "Innings 1"}&nbsp;
                        ({innings[0]?.RunsScored}/{innings[0]?.NumberOfWicketsFallen})
                    </button>
                )}

                {innings.length > 1 && (
                    <button
                        className={`px-4 py-2 mx-2 rounded ${currentInning === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => handleInningChange(1)}
                    >
                        {innings[1]?.BattingTeamId ? getBattingTeamName(innings[1].BattingTeamId) : "Innings 2"}&nbsp;
                        ({innings[1]?.RunsScored}/{innings[1]?.NumberOfWicketsFallen})
                    </button>
                )}

                {innings.length > 2 && (
                    <button
                        className={`px-4 py-2 mx-2 rounded ${currentInning === 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => handleInningChange(2)}
                    >
                        {innings[2]?.BattingTeamId ? getBattingTeamName(innings[2].BattingTeamId) : "Innings 3"}&nbsp;
                        ({innings[2]?.RunsScored}/{innings[2]?.NumberOfWicketsFallen})
                    </button>
                )}

                {innings.length > 3 && (
                    <button
                        className={`px-4 py-2 mx-2 rounded ${currentInning === 3 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => handleInningChange(3)}
                    >
                        {innings[3]?.BattingTeamId ? getBattingTeamName(innings[3].BattingTeamId) : "Innings 4"}&nbsp;
                        ({innings[3]?.RunsScored}/{innings[3]?.NumberOfWicketsFallen})
                    </button>
                )}
            </div>

            {innings.length > 0 && (
                <div className="mb-5">
                    <table className="w-full border-collapse mb-5">
                        <thead>
                            <tr>
                                <th className="bg-gray-200 p-2 text-left">Batsman</th>
                                <th className="bg-gray-200 p-2 text-left"></th>
                                <th className="bg-gray-200 p-2 text-left">R</th>
                                <th className="bg-gray-200 p-2 text-left">B</th>
                                <th className="bg-gray-200 p-2 text-left">4s</th>
                                <th className="bg-gray-200 p-2 text-left">6s</th>
                                <th className="bg-gray-200 p-2 text-left">SR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(innings[currentInning].Batsmen || []).map((batsman, id) => {
                                const player = players.find(player => player.Id === batsman.PlayerId);
                                const ballsFacedDisplay = batsman.BallsFaced === 0 ? "" : batsman.BallsFaced;

                                const isYetToBat = batsman.BallsFaced === 0 && !batsman.IsOnStrike && !batsman.IsBatting && !batsman.IsOut;

                                if (isYetToBat) {
                                    return null;
                                }
                                const playerImageUrl = (player?.PlayerDetails?.[0]?.ImageUrl) || player?.ImageUrl || "https://static-files.cricket-australia.pulselive.com/headshots/288/placeholder.png";
                                return (
                                    <tr key={id}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    // src={player?.playerDetails?.ImageUrl || "https://static-files.cricket-australia.pulselive.com/headshots/288/placeholder.png"}
                                                    src={playerImageUrl}
                                                    alt={player ? player.DisplayName : 'Unknown Player'}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <span
                                                    onClick={() => handlePlayerClick(batsman.PlayerId)}
                                                    onMouseEnter={() => setHoveredPlayerId(batsman.PlayerId)}
                                                    onMouseLeave={() => setHoveredPlayerId(null)}
                                                    className={`cursor-pointer text-blue-500 ${hoveredPlayerId === batsman.PlayerId ? 'underline' : ''}`}
                                                >
                                                    {player ? player.DisplayName : 'Unknown Player'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2">{batsman.DismissalText || 'Not Out'}</td>
                                        <td className="p-2">{batsman.RunsScored}</td>
                                        <td className="p-2">{ballsFacedDisplay}</td>
                                        <td className="p-2">{batsman.FoursScored}</td>
                                        <td className="p-2">{batsman.SixesScored}</td>
                                        <td className="p-2">{batsman.StrikeRate}</td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td className="p-2">Extras</td>
                                <td className="p-2">
                                    (wd {innings[currentInning].WideBalls}, nb {innings[currentInning].NoBalls}, lb {innings[currentInning].LegByesRuns}, b {innings[currentInning].ByesRuns}, p {innings[currentInning].Penalties})
                                </td>
                                <td className="p-2">{innings[currentInning].TotalExtras || 0}</td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2">Total</td>
                                <td className="p-2"></td>
                                <td className="p-2">{innings[currentInning].RunsScored || 0}</td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                            <tr>
                                <td className="p-2">Yet to Bat</td>
                                <td className="p-2">
                                    {(innings[currentInning].Batsmen || [])
                                        .filter(batsman =>
                                            batsman.BallsFaced === 0 && !batsman.IsOnStrike && !batsman.IsBatting && !batsman.IsOut
                                        )
                                        .map((batsman, id) => {
                                            const player = players.find(player => player.Id === batsman.PlayerId);
                                            return (
                                                <span
                                                    key={id}
                                                    onClick={() => handlePlayerClick(batsman.PlayerId)}
                                                    onMouseEnter={() => setHoveredPlayerId(batsman.PlayerId)}
                                                    onMouseLeave={() => setHoveredPlayerId(null)}
                                                    className={`cursor-pointer text-blue-500 ${hoveredPlayerId === batsman.PlayerId ? 'underline' : ''}`}
                                                >
                                                    {player ? player.DisplayName : 'Unknown Player'}
                                                </span>
                                            );
                                        })
                                    }
                                </td>
                            </tr>

                        </tbody>

                    </table>

                    <h4 className="text-lg mb-2">Fall of Wickets</h4>
                    <p className="text-gray-600 mb-5">
                        {(innings[currentInning].Wickets || [])
                            .map(wicket =>
                                `${wicket.Runs}-${wicket.Order} (${players.find(player => player.Id === wicket.PlayerId)?.DisplayName || 'Unknown Player'}, ${wicket.OverBallDisplay})`
                            )
                            .join(", ")}
                    </p>

                    <h4 className="text-lg mb-2">Bowling Summary</h4>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="bg-gray-200 p-2 text-left">Bowler</th>
                                <th className="bg-gray-200 p-2 text-left">O</th>
                                <th className="bg-gray-200 p-2 text-left">M</th>
                                <th className="bg-gray-200 p-2 text-left">R</th>
                                <th className="bg-gray-200 p-2 text-left">W</th>
                                <th className="bg-gray-200 p-2 text-left">NB</th>
                                <th className="bg-gray-200 p-2 text-left">WD</th>
                                <th className="bg-gray-200 p-2 text-left">ER</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(innings[currentInning].Bowlers || []).map((bowler, id) => {
                                const player = players.find(player => player.Id === bowler.PlayerId);
                                return (
                                    <tr key={id}>
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={player?.ImageUrl || "https://static-files.cricket-australia.pulselive.com/headshots/288/placeholder.png"}
                                                    alt={player ? player.DisplayName : 'Unknown Player'}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <span
                                                    onClick={() => handlePlayerClick(bowler.PlayerId)}
                                                    onMouseEnter={() => setHoveredPlayerId(bowler.PlayerId)}
                                                    onMouseLeave={() => setHoveredPlayerId(null)}
                                                    className={`cursor-pointer text-blue-500 ${hoveredPlayerId === bowler.PlayerId ? 'underline' : ''}`}
                                                >
                                                    {player ? player.DisplayName : 'Unknown Player'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2">{bowler.OversBowled}</td>
                                        <td className="p-2">{bowler.MaidensBowled}</td>
                                        <td className="p-2">{bowler.RunsConceded}</td>
                                        <td className="p-2">{bowler.WicketsTaken}</td>
                                        <td className="p-2">{bowler.NoBalls}</td>
                                        <td className="p-2">{bowler.WideBalls}</td>
                                        <td className="p-2">{bowler.Economy}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Scorecard;
