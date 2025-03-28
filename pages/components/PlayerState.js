import React, { useEffect, useState } from "react";

const PlayerStatsTable = ({ competitionId }) => {
  const [playerStats, setPlayerStats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Batting");
  const [selectedSubMenu, setSelectedSubMenu] = useState("Top Scorer");

  const apiEndpoints = {
    "Top Scorer": 1,
    "Most Fours Scored": 3,
    "Most Sixes Scored": 4,
    "Strike Rate": 5,
    "Highest Opening Partnership": 8,
    "Most Wickets Taken": 2,
    "Best Bowling Economy": 6,
    "Most WicketKeeper Dismissals": 9,
  };

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!competitionId) {
        setError("Invalid competition ID");
        setLoading(false);
        return;
      }

      const leaderId = apiEndpoints[selectedSubMenu] || 1;
      const url = `/api/playerstats/leaders/${leaderId}?competitionId=${competitionId}&limit=20`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (!data.PlayerStats) throw new Error("Invalid API response format");

        setPlayerStats(
          data.PlayerStats.map((player) => ({
            id: player.Id,
            name1: player.FirstPlayerName,
            name2: player.SecondPlayerName,
            team: player.TeamName,
            runs: player.RunsScored,
            wickets: player.WicketsTaken,
            fours: player.FoursScored,
            sixes: player.SixesScored,
            strikeRate: player.StrikeRate,
            economyRate: player.EconomyRate,
            highestRuns: player.HighestRuns,
            dismissals: player.WicketsTaken,
          }))
        );
      } catch (error) {
        console.error("Error fetching player stats:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [competitionId, selectedSubMenu]);

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    setSelectedSubMenu(menu === "Batting" ? "Top Scorer" : "Most Wickets Taken");
  };

  const renderColumnHeader = () => {
    switch (selectedSubMenu) {
      case "Most Wickets Taken":
        return "Wickets ";
      case "Strike Rate":
        return "Strike Rate";
      case "Most Fours Scored":
        return "Fours";
      case "Most Sixes Scored":
        return "Sixes";
      case "Highest Opening Partnership":
        return "Runs";
      case "Best Bowling Economy":
        return "Economy";
      case "Most WicketKeeper Dismissals":
        return "Dismissals";
      default:
        return "Runs";
    }
  };

  const renderTableRowData = (player) => {
    switch (selectedSubMenu) {
      case "Most Wickets Taken":
        return player.wickets;
      case "Strike Rate":
        return player.strikeRate;
      case "Most Fours Scored":
        return player.fours;
      case "Most Sixes Scored":
        return player.sixes;
      case "Highest Opening Partnership":
        return player.highestRuns;
      case "Best Bowling Economy":
        return player.economyRate;
      case "Most WicketKeeper Dismissals":
        return player.dismissals;
      default:
        return player.runs;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Main Menu Tabs */}
      <div className="flex -b mb-4">
        {["Batting", "Bowling & Fielding"].map((menu) => (
          <button
            key={menu}
            onClick={() => handleMenuSelect(menu)}
            className={`py-2 px-4 w-1/2 text-center font-semibold border-b-2  ${selectedMenu === menu ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-200"}`}
          >
            {menu}
          </button>
        ))}
      </div>

      {/* Submenu */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(selectedMenu === "Batting"
            ? ["Top Scorer", "Strike Rate", "Most Fours Scored", "Most Sixes Scored", "Highest Opening Partnership"]
            : ["Most Wickets Taken", "Best Bowling Economy", "Most WicketKeeper Dismissals"]
          ).map((subMenu) => (
            <button
              key={subMenu}
              onClick={() => setSelectedSubMenu(subMenu)}
              className={`px-3 py-1 rounded-md text-sm ${selectedSubMenu === subMenu ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              {subMenu}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Table */}
      <h2 className="text-xl font-bold mb-4 text-gray-200">{selectedMenu} - {selectedSubMenu}</h2>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full  -gray-300 shadow-lg text-left text-black">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className=" p-3" colSpan={2}>Player Name</th>
              <th className=" p-3">Team Name</th>
              <th className=" p-3">{renderColumnHeader()}</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.length > 0 ? (
              playerStats.map((player) => (
                <tr key={player.id} className="odd:bg-white even:bg-gray-200">
                  <td className="  p-3">{player.id}</td>
                  <td className=" p-3">
                    {player.name2 ? `${player.name1} & ${player.name2}` : player.name1}
                  </td>
                  <td className=" p-3">
                    {player.team ? player.team : (
                      <img
                        src="https://static-files.cricket-australia.pulselive.com/flag/36/placeholder.png"
                        alt="Placeholder"
                        className="w-12 h-8"
                      />
                    )}
                  </td>
                  <td className=" p-3 font-semibold">{renderTableRowData(player)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center  p-3 text-gray-500">No player stats available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerStatsTable;
