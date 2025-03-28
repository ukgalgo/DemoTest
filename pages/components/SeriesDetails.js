import React, { useState, useEffect } from 'react';
import { SDate } from '../utils/formatters';
import Standings from './Standings';
import PlayerStats from './PlayerState';
import SeriesMatches from './SeriesMatches';

const SeriesDetails = ({ competition }) => {
    const [activeButton, setActiveButton] = useState('matches'); 
    const [standingsAvailable, setStandingsAvailable] = useState(false); 

    if (!competition) {
        return <div>No competition selected</div>;
    }

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`/api/views/standings?CompetitionId=${competition.CompetitionId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setStandingsAvailable(data.Standings && data.Standings.length > 0);
            } catch (error) {
                console.error('Error fetching standings:', error);
                setStandingsAvailable(false);
            }
        };

        const intervalId = setInterval(fetchStandings, 2000);

        return () => clearInterval(intervalId);
    }, [competition.CompetitionId]); 

    const handleButtonClick = (button) => {
        setActiveButton(button); 
    };

    return (
        <div className="container mx-auto p-5">
            <div
                className="h-64 flex items-center p-6 bg-cover bg-center z-index-105"
                style={{ backgroundImage: `url(${competition.BannerUrl})` }}
            >
                <img
                    src={competition.LogoUrl}
                    alt={`${competition.Name} Logo`}
                    className="w-40 h-40 object-contain mr-6"
                />
                <div className="flex flex-col justify-between">
                    <h2 className="text-5xl font-semibold text-white uppercase">{competition.Name}</h2>
                    <h4 className="text-2xl font-medium text-gray-300">
                        {SDate(competition.StartDateTime)} - {SDate(competition.EndDateTime)}
                    </h4>
                </div>
            </div>

            <div className="flex justify-center mt-[-20]">
                <button
                    className={`px-4 py-2 text-black ${activeButton === 'matches' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                    onClick={() => handleButtonClick('matches')}
                >
                    Matches
                </button>

                {standingsAvailable && (
                    <button
                        className={`px-4 py-2 text-black ${activeButton === 'standings' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                        onClick={() => handleButtonClick('standings')}
                    >
                        Standings
                    </button>
                )}

                <button
                    className={`px-4 py-2 text-black ${activeButton === 'statistics' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-500 hover:text-white'}`}
                    onClick={() => handleButtonClick('statistics')}
                >
                    Statistics
                </button>
            </div>

            {activeButton === 'matches' && (
                <div className="mt-5">
                    <SeriesMatches competitionId={competition.CompetitionId} />
                </div>
            )}

            {activeButton === 'standings' && standingsAvailable && (
                <div className="mt-5">
                    <Standings competitionId={competition.CompetitionId} />
                </div>
            )}

            {activeButton === 'statistics' && (
                <div className="mt-5">
                    <PlayerStats competitionId={competition.CompetitionId} />
                </div>
            )}
        </div>
    );
};

export default SeriesDetails;
