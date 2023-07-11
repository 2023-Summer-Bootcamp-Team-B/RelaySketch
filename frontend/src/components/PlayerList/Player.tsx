import border from "../../assets/images/border.png";

type PlayerPropsType = {
  name: string;
};

const Player = ({ name }: PlayerPropsType) => (
  <li className=" w-[14vw] h-[10vh] mt-[2vh] ">
    <img src={border} alt="" className="relative z-10 w-[15vw] h-[11vh]" />
    <span className="relative bottom-[7.4vh] text-xl md:text-2xl lg:text-3xl xl:text-4xl">
      {name}
    </span>
  </li>
);

export default Player;
