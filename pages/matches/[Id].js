import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatDate } from "../utils/formatters";
import Scorecard from "../components/ScoreCard";
import Commentary from "../components/Commentry";
import MatchSummary from "../components/Summary";

function MatchDetails() {
    const router = useRouter();
    const { Id } = router.query; 
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScorecard, setShowScorecard] = useState(false);
    const [showCommentry, setShowCommentry] = useState(false); 

    const fetchMatchDetail = async () => {
        if (!Id) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/views/summary?FixtureId=${Id}`);
            if (!response.ok) throw new Error("❌ Failed to fetch match details");
            const data = await response.json();
            setSummary(data);
        } catch (err) {
            console.error("Error fetching match details:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatchDetail();
    }, [Id]);

    if (loading) return <p className="text-lg text-center mt-5">Loading match summary...</p>;
    if (error) return <p className="text-lg text-center mt-5">Error: {error}</p>;
    if (!summary) return <p className="text-lg text-center mt-5">No match summary available.</p>;

    const { Fixture, Players } = summary;
    const { HomeTeam, AwayTeam, Innings } = Fixture;
    const currentInning = Innings.length - 1; 

    const getTeamScore = (teamId) => {
        const teamInnings = Innings.filter(inning => inning.BattingTeamId === teamId);
        
        if (teamInnings.length > 0) {
            return teamInnings.map(inning => 
                `${inning.RunsScored}/${inning.NumberOfWicketsFallen} (${inning.OversBowled} ov)`
            ).join(' & ');
        }
        return "Yet to bat";
    };

    return (
        <div className="p-5 font-sans mx-auto max-w-6xl">
            <div className="mb-5 ">
                <h1 className="text-2xl mb-2">{HomeTeam.Name} vs {AwayTeam.Name}, Match - Live Cricket Score, Commentary</h1>
                <div className="text-sm text-gray-100">
                    <span className="font-bold">Series: </span>
                    <a  className="text-blue-500 hover:underline">{Fixture.Competition.Name}</a>&nbsp;&nbsp;&nbsp;
                    <span className="font-bold"> Venue: </span>
                    <a href={Fixture.Venue.Url} className="text-blue-500 hover:underline">{Fixture.Venue.Name}, {Fixture.Venue.City}</a>&nbsp;&nbsp;&nbsp;
                    <span className="font-bold"> Date & Time: </span>
                    {formatDate(Fixture.StartDateTime)}
                </div>
            </div>

            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                    <img src={HomeTeam.LogoUrl} alt="Team Logo" className="w-12 h-12 mr-2 rounded-full" />
                    <div>
                        <p className="font-bold">{HomeTeam.Name}</p>
                        <p>{getTeamScore(HomeTeam.Id)}</p>
                    </div>
                </div>

                <div className="text-center">
                    <img src={Fixture.Competition.ImageUrl} alt={Fixture.Competition.Name} className="w-10 h-10 " />
                </div>

                <div className="flex items-center">
                    <div>
                        <p className="font-bold">{AwayTeam.Name}</p>
                        <p>{getTeamScore(AwayTeam.Id)}</p>
                    </div>
                    <img src={AwayTeam.LogoUrl} alt={AwayTeam.Name} className="w-12 h-12 ml-2 rounded-full" />
                </div>
            </div>

            {Fixture.ResultText ? (
                <p className="text-lg font-bold text-center my-5">{Fixture.ResultText}</p>
            ) : Fixture.TossResult ? (
                <p className="text-lg font-bold text-center my-5">{Fixture.TossResult}</p>
            ) : null}

            <div className="flex justify-center mb-5">
                <button
                    onClick={() => {
                        setShowScorecard(false);
                        setShowCommentry(false);
                    }}
                    className={`px-4 py-2 mx-2 rounded ${!showScorecard && !showCommentry ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                    Summary
                </button>
                <button
                    onClick={() => {
                        setShowScorecard(true);
                        setShowCommentry(false);
                    }}
                    className={`px-4 py-2 mx-2 rounded ${showScorecard ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                    Scorecard
                </button>
                <button
                    onClick={() => {
                        setShowCommentry(true);
                        setShowScorecard(false);
                    }}
                    className={`px-4 py-2 mx-2 rounded ${showCommentry ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                >
                    Commentary
                </button>
            </div>

            {showScorecard ? (
                <Scorecard innings={Innings} players={Players} homeTeam={HomeTeam} awayTeam={AwayTeam} />
            ) : showCommentry ? (
                <Commentary Id={Id} homeTeam={HomeTeam} awayTeam={AwayTeam} />
            ) : (
                <MatchSummary 
                    Fixture={Fixture} 
                    Players={Players} 
                    HomeTeam={HomeTeam} 
                    AwayTeam={AwayTeam} 
                    Innings={Innings} 
                    currentInning={currentInning} 
                />
            )}
        </div>
    );
}

export default MatchDetails;    