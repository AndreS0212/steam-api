const GameList = ({ filterGames, switchValue }) => {
  return (
    <div>
      <p className="ms-1 text-start">
        {switchValue ? "Mas jugados:" : "Jugados recientemente:"}
      </p>
      <div
        className={`${
          filterGames?.length === 1 ? "mt-8" : "mt-3"
        } flex flex-wrap justify-around`}
      >
        {filterGames?.map((item) => (
          <div className={`mb-3 ${"w-[45%] h-[50px]"}`} key={item.appid}>
            <div className="flex flex-row">
              <img
                src={item.urlIcon}
                alt={item.name}
                className="w-fit h-[45px] rounded-md border border-gray-300"
              />
              <div className="text-start ms-1">
                <p className="text-md line-clamp-1 ">{item.name}</p>
                <p className="text-xs">{item.hoursPlayed.toFixed(1)} h</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
