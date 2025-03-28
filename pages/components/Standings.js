import { useEffect, useState } from 'react';

const Standings = ({ competitionId }) => {
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const response = await fetch(`/api/views/standings?CompetitionId=${competitionId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data); // Log the entire data object
                setStandings(data.Standings);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (competitionId) {
            fetchStandings();
        }
    }, [competitionId]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

    // Group teams by GroupName
    const groupedStandings = standings.reduce((acc, team) => {
        const groupName = team.GroupName || ''; 
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(team);
        return acc;
    }, {});

    // Check if any team has specific properties
    const hasNetRunRate = standings.some(team => team.NetRunRate !== undefined);
    const hasBowlingBonus = standings.some(team => team.BowlingBonus !== undefined);
    const hasBattingBonus = standings.some(team => team.BattingBonus !== undefined);
    const hasMatchTied = standings.some(team => team.MatchTied !== undefined);
    const hasDrawn = standings.some(team => team.Drawn !== undefined);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4 uppercase">Points Table</h1>
            {Object.keys(groupedStandings).map((groupName) => (
                <div key={groupName} className="mb-8">
                    <h2 className="text-xl font-semibold mb-2 text-gray-200">{groupName}</h2>
                    <table className="min-w-full bg-gray-200 text-black text-center border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800"> 
                                <th className="p-2 text-left" colSpan={3}>Team</th>
                                <th className="p-2">M</th>
                                <th className="p-2">W</th>
                                <th className="p-2">L</th>
                                {hasMatchTied && <th className="p-2">T</th>}
                                {hasDrawn && <th className="p-2">D</th>}
                                <th className="p-2">N/R</th>
                                <th className="p-2">DED.</th>
                                {hasNetRunRate && <th className="p-2">NRR</th>}
                                {hasBattingBonus && <th className="p-2">BAT</th>}
                                {hasBowlingBonus && <th className="p-2">BOWL</th>}
                                <th className="p-2">PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedStandings[groupName].map((team, index) => (
                                <tr key={team.TeamId} className="border-b border-gray-400">
                                    <td className="p-2">{team.Position}</td>
                                    <td className="p-2">
                                        <img
                                            src={team.LogoUrl || 'path/to/default/logo.png'}
                                            alt={`${team.TeamName} Logo`}
                                            className="w-10 h-10 object-contain"
                                        />
                                    </td>
                                    <td className="p-2 text-left">{team.TeamName}</td>
                                    <td className="p-2">{team.Played}</td>
                                    <td className="p-2">{team.Won}</td>
                                    <td className="p-2">{team.Lost}</td>
                                    {hasMatchTied && <td className="p-2">{team.MatchTied}</td>}
                                    {hasDrawn && <td className="p-2">{team.Drawn}</td>}
                                    <td className="p-2">{team.NoResult}</td>
                                    <td className="p-2">{(team.Deductions || 0).toFixed(2)}</td>
                                    {hasNetRunRate && <td className="p-2">{(team.NetRunRate || 0).toFixed(2)}</td>}
                                    {hasBattingBonus && <td className="p-2">{team.BattingBonus}</td>}
                                    {hasBowlingBonus && <td className="p-2">{team.BowlingBonus}</td>}
                                    <td className="p-2">{(team.Points || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default Standings;