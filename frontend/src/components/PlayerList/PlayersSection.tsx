import PlayerList from "./PlayerList";
import border from "../../assets/images/long_border.png";
import Header from "../Header/Header";

const PlayersSection = () => (
  <>
    <div className=" absolute z-10 left-[18.7vw] bottom-[11vh] hidden sm:flex">
      <img src={border} alt="" className="w-[18vw] h-[71.3vh]" />
    </div>
    <div className=" mr-4 text-center absolute left-[19.8vw] bottom-[14vh] ">
      <Header className=" sm:flex hidden text-[40px] mb-5 ml-[30px] ">
        플레이어
      </Header>
      <PlayerList />
    </div>
  </>
);

export default PlayersSection;
