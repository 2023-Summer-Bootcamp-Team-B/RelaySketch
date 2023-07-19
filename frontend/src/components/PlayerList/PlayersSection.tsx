import PlayerList from "./PlayerList";
import border from "../../assets/images/long_border.png";
import Header from "../Header/Header";

type PlayerSet = {
  name: string;
  myTurn: boolean;
};

type PlayersSectionPropsType = {
  players: PlayerSet[];
};

const PlayersSection = ({ players }: PlayersSectionPropsType) => (
  <>
    <div className=" absolute z-10 left-[18.7vw] bottom-[11vh]">
      <img src={border} alt="" className="w-[18vw] h-[71.3vh]" />
    </div>
    <div className=" mr-4 text-center absolute left-[19.8vw] bottom-[14vh] ">
      <Header className=" text-3xl md:text-4xl xl:text-5xl mb-4 ">
        플레이어
      </Header>
      <PlayerList players={players} />
    </div>
  </>
);

export default PlayersSection;
