import Player from "./Player";

interface PlayerSet {
  name: string;
}

type PlayerListPropsType = {
  players: PlayerSet[];
};

const PlayerList = ({ players }: PlayerListPropsType) => (
  <ul className=" w-[16vw] h-[67vh] flex flex-col items-center text-lg md:text-2xl lg:text-3xl bg-[white] pt-[2vh] overflow-auto list-none">
    {players.map((player: PlayerSet) => (
      <Player name={player.name} key={player.name} />
    ))}
  </ul>
);

export default PlayerList;
