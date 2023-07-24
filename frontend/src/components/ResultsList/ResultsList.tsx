import { observer } from "mobx-react";

import Result from "./Result";
import downloadBtnImg from "../../assets/images/download.svg";
import playBtnImg from "../../assets/images/play.svg";
import WebsocketStore from "../../stores/WebsocketStore";
import Button from "../UI/Button";

const ResultsList = observer(() => {
  const { playerList, total, gameResult, send } = WebsocketStore;
  let current = 0;

  const newGameHandler = () => {
    // playerroom 페이지로 이동
  };
  const downloadHandler = () => {
    // 현재 있는 이미지 다운로드
  };
  const showResultHandler = () => {
    send({ event: "wantResult", data: playerList[current].player_id });
    current += 1;
  };

  return (
    <div className="w-[42.3vw] h-[65vh] bg-[white] flex justify-center">
      {gameResult.length === 0 && (
        <Button type="button" onClick={showResultHandler}>
          <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] p-8 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
            <img
              src={playBtnImg}
              alt="play a new game"
              className="w-[3vw] h-auto"
            />
            <span className="ml-2 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl">
              결과 보기
            </span>
          </div>
        </Button>
      )}
      {gameResult.length >= 1 && (
        <ul className=" overflow-auto scrollbar-hide p-2 list-none ">
          {gameResult.map((result) => (
            <li key={result.playerId}>
              <Result
                name={result.name}
                title={result.title}
                image={result.img}
              />
            </li>
          ))}
          {/* 마지막 결과가 아닌 경우 */}
          {current !== total && (
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
              <Button type="button" onClick={showResultHandler}>
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
          {current === total && (
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
      )}
    </div>
  );
});

export default ResultsList;
