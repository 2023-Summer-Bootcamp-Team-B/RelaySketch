import sketchBook from "../../assets/images/sketchbook.png";
import sunny from "../../assets/images/sun.svg";

type ResultPropsType = {
  input: string;
  name: string;
  image: string | undefined;
  isLast: boolean;
};

const Result = ({ name, input, image, isLast }: ResultPropsType) => (
  <>
    <div className=" text-right text-lg md:text-2xl mb-4 relative z-10">
      <span className="mr-4">{input}</span>
      <span>{name}</span>
    </div>
    {!isLast && (
      <div className=" flex items-start mb-4 ">
        <div className=" flex mt-4 relative z-10 h-[35vh]">
          <img src={sunny} alt="" className=" w-[2vw] h-[4vh] ml-2 " />
          <span className="text-lg md:text-2xl ml-1 ">태양</span>
        </div>
        <div className=" h-[39vh]">
          <img
            src={sketchBook}
            alt=""
            className=" w-[28vw] h-[39vh] relative z-10 "
          />
          <img
            src={image}
            alt=""
            className=" w-[23vw] h-[34vh] relative left-[2.5vw] bottom-[35vh]"
          />
        </div>
      </div>
    )}
  </>
);

export default Result;
