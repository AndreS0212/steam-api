import { LuGamepad2 } from "react-icons/lu";
import steamIcon from "../assets/steam-icon.svg";
const UserProfile = ({
  userData,
  levelBorder,
  switchValue,
  setSwitchValue,
  colorStatus,
  hasGames,
}) => {
  return (
    <div className="mt-6">
      <div className={`flex flex-row justify-evenly items-center mb-5`}>
        <a
          href={userData?.urlProfile}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={userData?.urlAvatar}
            alt="Avatar"
            className={`h-[105px] w-fit rounded-md border-4 ${colorStatus()}`}
          />
        </a>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl  border-4 ${levelBorder()}`}
        >
          {userData?.userLevel}
        </div>
        <div className="flex items-center ">
          <div className="flex flex-col align-middle">
            <a
              href={userData?.urlProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center mb-2"
            >
              <img src={steamIcon} alt="" className="h-9 mb-1" />
              <p className="ms-1 text-xl font-bold max-w-[150px] truncate">
                {userData?.profileName}
              </p>
            </a>
            {userData.gamePlaying && (
              <div className="flex flex-row items-center justify-center">
                <LuGamepad2 color="#4ade80" size={20} />
                <p className="max-w-[110px] truncate ms-1 text-sm  text-green-400">
                  {userData.gamePlaying}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between my-2">
        <div className="flex flex-col items-start">
          {hasGames && <p>Total de juegos: {userData.gameCount}</p>}
          <p className="mt-1">
            Fecha de creación: {userData.timeCreated.slice(0, 10)}
          </p>
        </div>
        <div>
          {hasGames && (
            <label
              className={`relative inline-flex items-center cursor-pointer  ${
                switchValue?.show ? "" : "hidden"
              } `}
            >
              <input
                type="checkbox"
                value={switchValue?.value}
                className={`sr-only peer`}
                onChange={() =>
                  setSwitchValue({ ...switchValue, value: !switchValue?.value })
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
