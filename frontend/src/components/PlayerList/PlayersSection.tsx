import PlayerList from "./PlayerList";
import border from "../../assets/images/border.png";
import Header from "../Header/Header";

interface PlayerSet {
  name: string;
  myTurn: boolean;
}

type PlayersSectionPropsType = {
  players: PlayerSet[];
};

const PlayersSection = ({ players }: PlayersSectionPropsType) => (
  <>
    <div className=" absolute z-10 left-[19vw] bottom-[9vh]">
      <img src={border} alt="" className="w-[17.5vw] h-[77vh]" />
    </div>
    <div className=" mr-4 text-center absolute left-[19.8vw] bottom-[14vh] ">
      <Header className=" text-3xl md:text-4xl xl:text-5xl ">플레이어</Header>
      <PlayerList players={players} />
    </div>
  </>
);

export default PlayersSection;
