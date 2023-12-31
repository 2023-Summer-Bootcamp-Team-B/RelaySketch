import { observer } from "mobx-react";

import border from "../../assets/images/border.png";

type PlayerPropsType = {
  name: string;
  turn: boolean;
};

const Player = observer(({ name, turn }: PlayerPropsType) => {
  const classes = turn
    ? " w-[13vw] h-[9vh] mt-[1.5vh] bg-[#7EC8FF] flex items-center justify-center"
    : " w-[13vw] h-[9vh] mt-[1.5vh] flex items-center justify-center";

  return (
    <li className={classes}>
      <img
        src={border}
        alt=""
        className="absolute z-10 w-[14vw] h-[10.1vh] left-[1.1vw]"
      />
      <span className="relative text-xl md:text-2xl lg:text-3xl xl:text-4xl">
        {name}
      </span>
    </li>
  );
});

export default Player;
