const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const getSteamId = async (steamLink) => {
  let steamUsername = "";
  if (steamLink.includes("id/")) {
    steamUsername = steamLink.split("id/")[1];
    if (steamUsername.includes("/"))
      steamUsername = steamUsername.split("/")[0];
  } else {
    steamUsername = steamLink;
  }
  try {
    const { data } = await axios.get(
      "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" +
        process.env.STEAM_KEY +
        "&vanityurl=" +
        steamUsername
    );
    if (data.response.success == 1) {
      return data.response.steamid;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserLevel = async (steamId) => {
  try {
    const { data } = await axios.get(
      "http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=" +
        process.env.STEAM_KEY +
        "&steamid=" +
        steamId
    );
    return data.response.player_level;
  } catch (error) {
    console.log(error);
    return null;
  }
};
const getUserData = async (steamId) => {
  try {
    const { data } = await axios.get(
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
        process.env.STEAM_KEY +
        "&steamids=" +
        steamId
    );
    let userLevel = await getUserLevel(steamId);
    const {
      personaname,
      avatarfull,
      profileurl,
      personastate,
      gameextrainfo,
      timecreated,
    } = data.response.players[0];
    return {
      profileName: personaname,
      urlAvatar: avatarfull,
      urlProfile: profileurl,
      userState: personastate,
      gamePlaying: gameextrainfo,
      userLevel,
      timeCreated: new Date(timecreated * 1000),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRecentlyPlayedGames = async (steamId) => {
  try {
    const { data } = await axios.get(
      "http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=" +
        process.env.STEAM_KEY +
        "&steamid=" +
        steamId +
        "&format=json"
    );
    const { games } = data.response;
    if (!games) return null;
    const recentlyPlayedGames = games?.slice(0, 4);
    const urlIcon = recentlyPlayedGames.map((game) => {
      return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
    });
    //i want only some data from games like name,playtime_forever,appid,img_icon_url,playtime_2weeks
    const gamesData = recentlyPlayedGames.map((game, index) => {
      return {
        name: game.name,
        hoursPlayed: game.playtime_2weeks / 60,
        appid: game.appid,
        urlIcon: urlIcon[index],
      };
    });
    return gamesData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//this is owned games i want to get the most played games
const getMostPlayedGames = async (steamId) => {
  try {
    const { data } = await axios.get(
      "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" +
        process.env.STEAM_KEY +
        "&steamid=" +
        steamId +
        "&format=json" +
        "&include_appinfo=true" +
        "&include_played_free_games=true"
    );
    const { game_count, games } = data.response;
    if (!games) return null;

    games.sort((a, b) => {
      return b.playtime_forever - a.playtime_forever;
    });
    const mostPlayedGames = games.slice(0, 4);
    const urlIcon = mostPlayedGames.map((game) => {
      return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
    });
    //i want only some data from games like name,playtime_forever,appid,img_icon_url,playtime_2weeks
    const gamesData = mostPlayedGames.map((game, index) => {
      return {
        name: game.name,
        hoursPlayed: game.playtime_forever / 60,
        appid: game.appid,
        urlIcon: urlIcon[index],
        hoursPlayed2Weeks: game.playtime_2weeks / 60,
      };
    });
    return {
      game_count,
      gamesData,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyId = (steamId) => {
  const regularExpression = /^[0-9]{17}$/;
  return regularExpression.test(steamId);
};
app.post("/", async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({
      message: "No se ha enviado el link de steam",
    });
  }
  //Llegara en formato de url y tenemos que pasarlo para solo tener el nombre de usuario
  const steamLink = req.body.url;
  let steamId = "";
  if (steamLink.includes("profiles/")) {
    steamId = steamLink.split("profiles/")[1];
  } else if (verifyId(steamLink)) {
    console.log(true);
    steamId = steamLink;
  } else {
    steamId = await getSteamId(steamLink);
  }
  if (!steamId) {
    return res.status(400).json({
      message: "No se ha encontrado el usuario o el link es incorrecto",
    });
  }
  if (steamId.includes("/")) {
    steamId = steamId.split("/")[0];
  }
  try {
    const userData = await getUserData(steamId);
    const mostPlayedGames = await getMostPlayedGames(steamId);
    const recentlyPlayedGames = await getRecentlyPlayedGames(steamId);

    return res.status(200).json({
      status: "success",
      userData: { ...userData, gameCount: mostPlayedGames?.game_count },
      mostPlayedGames: mostPlayedGames?.gamesData,
      recentlyPlayedGames,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor esrto");
});
