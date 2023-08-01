import { observer } from "mobx-react";

import Result from "./Result";
import playBtnImg from "../../assets/images/play.svg";
import WebsocketStore from "../../stores/WebsocketStore";
import Header from "../Header/Header";
import Button from "../UI/Button";

const ResultsList = observer(() => {
  const {
    myId,
    hostId,
    allEnteredPlayers,
    gameResult,
    currentIdx,
    nameOfCurrentResult,
    send,
  } = WebsocketStore;

  const showResultHandler = () => {
    const id = allEnteredPlayers[currentIdx].player_id;
    send({ event: "wantResult", data: { playerId: id } });
  };

  return (
    <>
      {/* 제목 */}
      {gameResult.length !== 0 && (
        <Header className="sm:text-[40px] text-[22px] text-center sm:mb-8 mb-[-20px] sm:mr-0 mr-2 ">
          {nameOfCurrentResult} 님의 스케치북
        </Header>
      )}
      {/* 스케치북 메인 */}
      <div className="sm:w-[42.3vw] sm:h-[65vh] w-[92vw] h-[44vh] flex justify-center items-center sm:ml-0 sm:mb-0 ml-[-150px] mb-[123px]">
        {/* 결과 보기 전, 즉 페이지 처음 이동해 왔을 때 방장이면 결과보기 버튼을 띄움 */}
        {gameResult.length === 0 && myId === hostId && (
          <Button type="button" onClick={showResultHandler}>
            <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] p-8 text-center shadow-lg flex justify-center items-center relative z-10">
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
        {/* 방장이 아니면 일반 메시지를 띄움 */}
        {gameResult.length === 0 && myId !== hostId && (
          <div className="h-auto border-dashed border-2 border-black rounded-[25px] w-fit p-8 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
            <span className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl">
              결과 보기를
              <br />
              기다리는 중...
            </span>
          </div>
        )}
        {/* 방장이 결과 보기 버튼을 눌렀을 때, 결과를 표시 */}
        {gameResult.length >= 1 && (
          <ul className="sm:w-[42.3vw] sm:h-[65vh] w-[100vw] h-[40vh] sm:mt-0 mt-16 overflow-auto scrollbar-hide p-2 list-none ">
            {gameResult.map((result, idx) => (
              <li key={result.player_name}>
                <Result
                  name={result.player_name}
                  title={result.title}
                  image={result.img}
                  index={idx}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
});

export default ResultsList;
