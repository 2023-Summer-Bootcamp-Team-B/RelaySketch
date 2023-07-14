import border from "../../assets/images/border.png";

type PlayerPropsType = {
  name: string;
  turn: boolean;
};

const Player = ({ name, turn }: PlayerPropsType) => {
  const classes = turn
    ? " w-[14vw] h-[10vh] mt-[2vh] bg-[#7EC8FF] flex items-center justify-center"
    : " w-[14vw] h-[10vh] mt-[2vh] flex items-center justify-center";

  return (
    <li className={classes}>
      <img
        src={border}
        alt=""
        className="absolute z-10 w-[15vw] h-[12vh] left-[0.5vw]"
      />
      <span className="relative text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        {name}
      </span>
    </li>
  );
};

export default Player;
