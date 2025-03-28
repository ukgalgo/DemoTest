import React from "react";
import { formatDate } from "../utils/formatters";

const MatchSummary = ({ Fixture, Players, HomeTeam, AwayTeam, Innings, currentInning }) => {
    const imageUrl = 
      Players.find(player => player.IsManOfTheMatch)?.PlayerDetails?.[0]?.ImageUrl ||
      Players.find(player => player.IsManOfTheMatch)?.ImageUrl || 
      "https://static-files.cricket-australia.pulselive.com/headshots/288/placeholder.png";

    return (
        <div>
            <div className="mt-5 flex justify-between ">
                {Fixture.IsCompleted ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 w-full">
                        <div className="flex items-center mb-2">
                            <img
                                src={imageUrl}
                                alt={Players.find(player => player.IsManOfTheMatch) ? Players.find(player => player.IsManOfTheMatch).DisplayName : 'Unknown Player'}
                                className="w-20 h-20 mr-2"
                            />
                            <div>
                                <h2 className="text-2xl font-extrabold ">PLAYER OF THE MATCH</h2>
                                <div className="h-0.5 bg-gray-500 mb-2 w-full"></div>
                                {Players.find(player => player.IsManOfTheMatch) ? (
                                    <p className="text-xl font-bold">
                                        {Players.find(player => player.IsManOfTheMatch).DisplayName}
                                    </p>
                                ) : (
                                    <p className="text-xl">Unknown Player</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    Fixture.IsLive || Fixture.GameStatusId === 'Stumps' ? (
                        <>
                            <div className="w-1/2 pr-2">
                                <table className="w-full border-collapse mb-5">
                                    <thead>
                                        <tr>
                                            <th className="bg-gray-200 p-2 text-left text-black">Batsman</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">R</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">B</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">4s</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">6s</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">SR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Innings[currentInning]?.Batsmen || [])
                                            .filter(batsman => batsman.IsBatting)
                                            .map((batsman, id) => {
                                                const player = Players.find(player => player.Id === batsman.PlayerId);
                                                return (
                                                    <tr key={id}>
                                                        <td className="p-2">
                                                            <span
                                                                onClick={() => handlePlayerClick(batsman.PlayerId)}
                                                                className="cursor-pointer text-blue-500"
                                                            >
                                                                {player ? player.DisplayName : 'Unknown Player'}
                                                            </span>
                                                        </td>
                                                        <td className="p-2">{batsman.RunsScored}</td>
                                                        <td className="p-2">{batsman.BallsFaced}</td>
                                                        <td className="p-2">{batsman.FoursScored}</td>
                                                        <td className="p-2">{batsman.SixesScored}</td>
                                                        <td className="p-2">{batsman.StrikeRate}</td>
                                                    </tr>
                                                );
                                            })}
                                        <tr>
                                            <td className="font-bold p-2" colSpan={3}>CRR: {Innings[currentInning]?.CurrentRunRate}</td>
                                            <td className="font-bold p-2" colSpan={3}>
                                                {Innings[currentInning]?.RequiredRunRate !== undefined ? (
                                                    <>RRR: {Innings[currentInning].RequiredRunRate}</>
                                                ) : null}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-2" colSpan={6}>
                                                {Innings[currentInning]?.Partnership ? (
                                                    `Current Partnership: ${Innings[currentInning].Partnership.TotalRunsScored} Run (${Innings[currentInning].Partnership.TotalBallsFaced}) Ball`
                                                ) : (
                                                    "No current partnership data available."
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="w-1/2 pl-2">
                                <table className="w-full border-collapse mb-5">
                                    <thead>
                                        <tr>
                                            <th className="bg-gray-200 p-2 text-left text-black">Bowling</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">O</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">M</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">R</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">W</th>
                                            <th className="bg-gray-200 p-2 text-left text-black">ECO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(Innings[currentInning]?.Bowlers || [])
                                            .filter(bowler => bowler.IsOnStrike)
                                            .map((bowler, id) => {
                                                const player = Players.find(player => player.Id === bowler.PlayerId);
                                                return (
                                                    <tr key={id}>
                                                        <td className="p-2">
                                                            <span
                                                                onClick={() => handlePlayerClick(bowler.PlayerId)}
                                                                className="cursor-pointer text-blue-500"
                                                            >
                                                                {player ? player.DisplayName : 'Unknown Player'}
                                                            </span>
                                                        </td>
                                                        <td className="p-2">{bowler.OversBowled}</td>
                                                        <td className="p-2">{bowler.MaidensBowled}</td>
                                                        <td className="p-2">{bowler.RunsConceded}</td>
                                                        <td className="p-2">{bowler.WicketsTaken}</td>
                                                        <td className="p-2">{bowler.Economy}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-200 text-center">The match is upcoming and will start soon.</p>
                    )
                )}
            </div>

            <div className="flex justify-between">
                <article className="w-[48%] flex flex-col gap-2">
                    <h2 className="text-lg mb-2">Match Info</h2>
                    <div className="w-full h-0.5 bg-white mb-2"></div>
                    <ul className="list-none p-0 flex flex-col gap-2">
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Toss</span>
                            <span>{Fixture.TossResult}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Venue</span>
                            <span>{Fixture.Venue.Name}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Date</span>
                            <span>{formatDate(Fixture.StartDateTime)}</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Umpires</span>
                            <span>
                                {Fixture.Officials?.filter(official => official.UmpireType.toLowerCase() === "onfield")
                                    .map(official => `${official.FirstName} ${official.LastName}`)
                                    .join(", ") || "Not Announced"}
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Third Umpire</span>
                            <span>
                                {Fixture.Officials?.find(official => official.UmpireType.toLowerCase() === "video")
                                    ? `${Fixture.Officials.find(official => official.UmpireType.toLowerCase() === "video").FirstName} ${Fixture.Officials.find(official => official.UmpireType.toLowerCase() === "video").LastName}`
                                    : "Not Announced"}
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold w-36">Match Referee</span>
                            <span>
                                {Fixture.Officials?.find(official => official.UmpireType.toLowerCase() === "matchreferee")
                                    ? `${Fixture.Officials.find(official => official.UmpireType.toLowerCase() === "matchreferee").FirstName} ${Fixture.Officials.find(official => official.UmpireType.toLowerCase() === "matchreferee").LastName}`
                                    : "Not Announced"}
                            </span>
                        </li>
                    </ul>
                </article>

                <article className="w-[48%] flex flex-col gap-2">
                    <h2 className="text-lg mb-2">Teams</h2>
                    <div className="w-full h-0.5 bg-white mb-2"></div>

                    <div className="flex gap-16 flex-row items-baseline">
                        <h3 className="text-lg whitespace-nowrap">{HomeTeam.ShortName}</h3>
                        <p className="flex-1">
                            {Players && Players.some(player => player.TeamId === HomeTeam.Id)
                                ? Players.filter(player => player.TeamId === HomeTeam.Id)
                                    .map(player => `${player.DisplayName}${player.IsCaptain ? " (c)" : ""}${player.IsWicketKeeper ? " (wk)" : ""}`)
                                    .join(", ")
                                : "Team to be announced"}
                        </p>
                    </div>

                    <div className="flex gap-16 flex-row items-baseline">
                        <h3 className="text-lg whitespace-nowrap">{AwayTeam.ShortName}</h3>
                        <p className="flex-1">
                            {Players && Players.some(player => player.TeamId === AwayTeam.Id)
                                ? Players.filter(player => player.TeamId === AwayTeam.Id)
                                    .map(player => `${player.DisplayName}${player.IsCaptain ? " (c)" : ""}${player.IsWicketKeeper ? " (wk)" : ""}`)
                                    .join(", ")
                                : "Team to be announced"}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default MatchSummary;