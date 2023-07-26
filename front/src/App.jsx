import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Search from "./components/Search";
import UserProfile from "./components/UserProfile";
import GameList from "./components/GameList";
import steamIcon from "./assets/steam-icon.svg";
import { useMutation } from "@tanstack/react-query";

function App() {
  //url o usuario a buscar
  const [searchValue, setSearchValue] = useState("");
  //Value si es true es para mostrar los mas jugados, si es false los recientes
  //show es para mostrar el botton de cambiar
  const [switchValue, setSwitchValue] = useState({
    value: true,
    show: true,
  });
  //info de steam que llega del backend
  const [steamInfo, setSteamInfo] = useState({});
  //juegos a mostrar
  const [games, setGames] = useState([]);
  const {
    userData,
    mostPlayedGames,
    recentlyPlayedGames,
    status,
    savedSwitchValue,
  } = steamInfo;
  //al llegar la data del fetch se setean los juegos
  useEffect(() => {
    if (userData) {
      setGames(switchValue.value ? mostPlayedGames : recentlyPlayedGames);
      //si hay un valor guardado en la db se setea sino se usa el valor por defecto
      if (savedSwitchValue) {
        setSwitchValue(savedSwitchValue);
      }
    }
  }, [userData]);

  //si se cambia el switch se cambia de juegos
  useEffect(() => {
    if (switchValue.value) {
      setGames(mostPlayedGames);
    } else {
      setGames(recentlyPlayedGames);
    }
  }, [switchValue]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  //si se apreta enter se hace el fetch
  const handleOnKeyDown = async (e) => {
    if (e.key === "Enter") {
      mutate();
    } else {
      return;
    }
  };

  //color del borde del avatar si esta conectado o no
  const colorStatus = () => {
    if (userData?.userState == "1") {
      return "border-green-500";
    } else if (status === "0") {
      return "border-red-500";
    } else if (status === "2") {
      return "border-orange-500";
    } else {
      return "border-gray-500";
    }
  };

  //color del borde del nivel de steam
  const levelBorder = () => {
    const userLevel = userData?.userLevel;
    if (userLevel < 10) {
      return "border-gray-500";
    } else if (userLevel < 20) {
      return "border-red-500";
    } else if (userLevel < 30) {
      return "border-orange-500";
    } else if (userLevel < 40) {
      return "border-yellow-500";
    } else if (userLevel < 50) {
      return "border-green-500";
    } else if (userLevel < 60) {
      return "border-blue-500";
    } else if (userLevel < 70) {
      return "border-purple-500";
    } else if (userLevel < 80) {
      return "border-pink-500";
    } else if (userLevel < 90) {
      return "border-[#804000]";
    } else if (userLevel < 100) {
      return "border-[#EABE3F]";
    } else {
      return "border-gray-500";
    }
  };
  //fetch a la api
  const { mutate, isLoading, isIdle, error, data } = useMutation(
    ["steam", searchValue],
    async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_TOKEN}/steam`,
        { url: searchValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_BACKEND_TOKEN}`,
          },
        }
      );
      return data;
    },
    {
      onSuccess: (data) => {
        setSteamInfo(data);
      },
      onError: (error) => {
        console.log(error);
      },
      enabled: false,
    }
  );

  return (
    <div
      //Si isIdle o isLoading es true se muestra el div de busqueda sino se muestra el perfil
      className={`${
        isIdle || isLoading
          ? "flex flex-col max-h-[390px]  rounded-xl shadow-2xl rounded-3x bg-white text-black"
          : "h-[390px] bg-[#171a21]  rounded-xl text-white"
      } mx-auto my-12 p-4 max-w-[390px] `}
      //Si no esta idle o loading se muestra el color de background tipo steam sino se muestra el background de busqueda
      style={{
        backgroundImage:
          !isIdle &&
          `radial-gradient(farthest-side at bottom right,rgba(109, 38, 44, 0.301), transparent 500px),
                   radial-gradient(farthest-corner at bottom left, rgba(50, 255, 193, 0.103), transparent 600px)`,
        backgroundColor: !isIdle && "rgba(34, 35, 48, 0.93)",
        backgroundRepeat: !isIdle ? "no-repeat" : "initial",
        backgroundPosition: "center",
      }}
    >
      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <div className="flex items-center h-full">
          <img src={steamIcon} alt="" className="h-9 mb-1" />
          <p className="text-2xl">Usuario o link de steam inválido. </p>
        </div>
      ) : data ? (
        <>
          <UserProfile
            userData={userData}
            levelBorder={levelBorder}
            setSwitchValue={setSwitchValue}
            switchValue={switchValue}
            colorStatus={colorStatus}
            hasGames={games?.length > 0}
          />
          <GameList
            filterGames={games}
            switchValue={switchValue?.value}
            hasGames={games?.length > 0}
          />
        </>
      ) : (
        <Search
          searchValue={searchValue}
          handleSearchChange={handleSearchChange}
          handleOnKeyDown={handleOnKeyDown}
        />
      )}
    </div>
  );
}

export default App;
