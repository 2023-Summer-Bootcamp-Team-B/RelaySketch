import { observer } from "mobx-react";

import Player from "./Player";
import WebsocketStore from "../../stores/WebsocketStore";

const PlayerList = observer(() => {
  const { players, nameOfCurrentResult } = WebsocketStore;

  return (
    <ul className=" w-[16vw] h-[67vh] sm:flex hidden flex-col items-center text-lg md:text-2xl lg:text-3xl bg-[white] pt-[2vh] overflow-auto list-none">
      {players.map((player: any) => (
        <Player
          name={player.name}
          turn={player.name === nameOfCurrentResult}
          key={player.player_id}
        />
      ))}
    </ul>
  );
});

export default PlayerList;
