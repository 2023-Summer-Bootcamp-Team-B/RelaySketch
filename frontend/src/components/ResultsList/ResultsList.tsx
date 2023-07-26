import Result from "./Result";
import downloadBtnImg from "../../assets/images/download.svg";
import playBtnImg from "../../assets/images/play.svg";
import Button from "../UI/Button";

type LabelImgSet = {
  name: string;
  input: string;
  src: string | undefined;
  isLast: boolean;
};

type ResultsListPropsType = {
  round: number;
  results: LabelImgSet[];
};

const ResultsList = ({ round, results }: ResultsListPropsType) => {
  const lastRound = 4;

  const newGameHandler = () => {};
  const downloadHandler = () => {};

  return (
    <ul className=" w-[42.3vw] h-[65vh] overflow-auto scrollbar-hide p-2 bg-[white] list-none ">
      {results.map((result) => (
        <li key={result.name}>
          <Result
            name={result.name}
            input={result.input}
            image={result.src}
            isLast={result.isLast}
          />
        </li>
      ))}
      {/* 마지막 결과가 아닌 경우 */}
      {lastRound !== round && (
        <div className=" flex items-center justify-center">
          <Button
            type="button"
            className="border-dashed border-2 border-black rounded-[25px] bg-[#E7F5FF] shadow-lg relative z-10"
            onClick={downloadHandler}
          >
            <img
              src={downloadBtnImg}
              alt="download button"
              className=" w-[4vw] h-[8vh] p-2"
            />
          </Button>
          <Button type="button" onClick={newGameHandler}>
            <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] pl-2 pr-2 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
              <img
                src={playBtnImg}
                alt="play a new game"
                className="w-[2vw] h-[4vh]"
              />
              <span className="ml-2 text-xs md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl">
                다음 결과 보기
              </span>
            </div>
          </Button>
        </div>
      )}
      {/* 마지막 결과인 경우 */}
      {lastRound === round && (
        <div className=" flex items-center justify-center">
          <Button
            type="button"
            className="border-dashed border-2 border-black rounded-[25px] bg-[#E7F5FF] shadow-lg relative z-10"
            onClick={downloadHandler}
          >
            <img
              src={downloadBtnImg}
              alt="download button"
              className=" w-[4vw] h-[8vh] p-2"
            />
          </Button>
          <Button type="button" onClick={newGameHandler}>
            <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] p-16 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
              <img
                src={playBtnImg}
                alt="play a new game"
                className="w-[2vw] h-[4vh]"
              />
              <span className="ml-2 text-xs md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl">
                새로운 턴
              </span>
            </div>
          </Button>
        </div>
      )}
    </ul>
  );
};

export default ResultsList;
