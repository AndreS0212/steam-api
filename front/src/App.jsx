import { useEffect, useState } from "react";
import axios from "axios";
import steamIcon from "./assets/steam-icon.svg";
import { LuGamepad2 } from "react-icons/lu";
import "./App.css";
import Search from "./components/Search";
import UserProfile from "./components/UserProfile";
import GameList from "./components/GameList";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [switchValue, setSwitchValue] = useState({
    value: true,
    show: true,
  });
  const [steamInfo, setSteamInfo] = useState({});
  const {
    userData,
    mostPlayedGames,
    recentlyPlayedGames,
    status,
    savedSwitchValue,
  } = steamInfo;
  const [filterGames, setFilterGames] = useState([]);
  useEffect(() => {
    if (userData) {
      setFilterGames(switchValue.value ? mostPlayedGames : recentlyPlayedGames);
      if (savedSwitchValue) {
        setSwitchValue(savedSwitchValue);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (switchValue.value) {
      setFilterGames(mostPlayedGames);
    } else {
      setFilterGames(recentlyPlayedGames);
    }
  }, [switchValue]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const customGradients = {
    gradientRight: "rgba(109, 38, 44, 0.301)",
    gradientLeft: "rgba(50, 255, 193, 0.103)",
    gradientBackground: "rgba(34, 35, 48, 0.93)",
    gradientBackgroundRight: "rgba(109, 38, 44, 0)",
  };

  const colorStatus = () => {
    if (userData.userState == "1") {
      return "border-green-500";
    } else if (status === "0") {
      return "border-red-500";
    } else if (status === "2") {
      return "border-orange-500";
    } else {
      return "border-gray-500";
    }
  };

  const levelBorder = () => {
    if (userData.userLevel < 10) {
      return "border-gray-500";
    } else if (userData.userLevel < 20) {
      return "border-red-500";
    } else if (userData.userLevel < 30) {
      return "border-orange-500";
    } else if (userData.userLevel < 40) {
      return "border-yellow-500";
    } else if (userData.userLevel < 50) {
      return "border-green-500";
    } else if (userData.userLevel < 60) {
      return "border-blue-500";
    } else if (userData.userLevel < 70) {
      return "border-purple-500";
    } else if (userData.userLevel < 80) {
      return "border-pink-500";
    } else if (userData.userLevel < 90) {
      return "border-[#804000]";
    } else if (userData.userLevel < 100) {
      return "border-[#EABE3F]";
    } else {
      return "border-gray-500";
    }
  };
  const handleOnKeyDown = async (e) => {
    if (e.key === "Enter") {
      try {
        const { data } = await axios.post("http://localhost:3000/", {
          url: searchValue,
        });
        setSteamInfo(data);
      } catch (err) {
        console.log(err);
      }
    } else {
      return;
    }
  };

  return (
    <div
      className={`max-w-[390px] ${
        steamInfo.userData ? "h-[390px] bg-[#171a21] text-white rounded-xl" : ""
      } flex flex-col max-h-[390px] mx-auto my-12 p-4  shadow-2xl rounded-3x bg-white`}
      style={{
        backgroundImage:
          steamInfo.status &&
          `radial-gradient(farthest-side at bottom right,rgba(109, 38, 44, 0.301), transparent 500px),
                   radial-gradient(farthest-corner at bottom left, rgba(50, 255, 193, 0.103), transparent 600px)`,
        backgroundColor: steamInfo.status && "rgba(34, 35, 48, 0.93)",
        backgroundRepeat: steamInfo.status ? "no-repeat" : "initial",
        backgroundPosition: "center",
      }}
    >
      {!steamInfo.status ? (
        <Search
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          handleOnKeyDown={handleOnKeyDown}
        />
      ) : (
        <>
          <UserProfile
            userData={userData}
            levelBorder={levelBorder}
            setSwitchValue={setSwitchValue}
            switchValue={switchValue}
            colorStatus={colorStatus}
          />
          {filterGames && (
            <GameList
              filterGames={filterGames}
              switchValue={switchValue?.value}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
