import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import Result from "./Result";
import downloadBtnImg from "../../assets/images/download.svg";
import playBtnImg from "../../assets/images/play.svg";
import WebsocketStore from "../../stores/WebsocketStore";
import Header from "../Header/Header";
import Button from "../UI/Button";

const ResultsList = observer(() => {
  const {
    myId,
    hostId,
    playerList,
    total,
    gameResult,
    currentIdx,
    nameOfCurrentResult,
    send,
  } = WebsocketStore;
  const zip = new JSZip();
  const navigate = useNavigate();
  const imgUrlList = gameResult.map((result) => result.img);
  // const currentResults = gameResult.map((result) => (
  //   <li key={result.player_name}>
  //     <Result
  //       name={result.player_name}
  //       title={result.title}
  //       image={result.img}
  //     />
  //   </li>))

  const newGameHandler = () => {
    navigate("/");
  };
  const downloadHandler = async () => {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i in imgUrlList) {
      // eslint-disable-next-line no-await-in-loop
      await axios({
        url: imgUrlList[i],
        method: "GET",
        responseType: "arraybuffer",
        withCredentials: false,
      })
        .then(async ({ data }) => {
          const fileName = `image_${i}.png`;
          zip.file(fileName, data, { binary: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "test_download.zip"));
  };

  const showResultHandler = () => {
    const id = playerList[currentIdx].player_id;
    send({ event: "wantResult", data: { playerId: id } });
  };

  // const wait = (sec: number) => {
  //   const start = Date.now();
  //   let now = start;
  //   while (now - start < sec * 1000) {
  //     now = Date.now();
  //   }
  // };

  return (
    <>
      {/* 제목 */}
      {gameResult.length !== 0 && (
        <Header className=" text-3xl md:text-4xl xl:text-5xl text-center mb-8 ">
          {nameOfCurrentResult} 님의 스케치북
        </Header>
      )}
      {/* 스케치북 메인 */}
      <div className="w-[42.3vw] h-[65vh] bg-[white] flex justify-center items-center">
        {/* 결과 보기 전, 즉 페이지 처음 이동해 왔을 때 방장이면 결과보기 버튼을 띄움 */}
        {gameResult.length === 0 && myId === hostId && (
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
        {/* 방장이 아니면 일반 메시지를 띄움 */}
        {gameResult.length === 0 && myId !== hostId && (
          <div className="h-auto border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] p-8 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
            <span className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl">
              결과 보기를
              <br />
              기다리는 중...
            </span>
          </div>
        )}
        {/* 방장이 결과 보기 버튼을 눌렀을 때, 결과를 표시 */}
        {gameResult.length >= 1 && (
          <ul className="w-[42.3vw] h-[65vh] overflow-auto scrollbar-hide p-2 list-none ">
            {gameResult.map((result) => (
              <li key={result.player_name}>
                <Result
                  name={result.player_name}
                  title={result.title}
                  image={result.img}
                />
              </li>
            ))}
            {/* 마지막 결과가 아닌 경우 */}
            {currentIdx !== total && (
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
                {/* 방장이 아니면 다음 결과 보기 버튼을 화면에 표시하지 않음 */}
                {myId === hostId && (
                  <Button type="button" onClick={showResultHandler}>
                    <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] pl-2 pr-2 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
                      <img
                        src={playBtnImg}
                        alt="play a new game"
                        className="w-[3vw] h-auto"
                      />
                      <span className="mr-2 text-xs md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl">
                        다음 결과 보기
                      </span>
                    </div>
                  </Button>
                )}
              </div>
            )}
            {/* 마지막 결과인 경우 */}
            {currentIdx === total && (
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
                  <div className=" border-dashed border-2 border-black rounded-[25px] w-fit h-[8vh] p-4 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
                    <img
                      src={playBtnImg}
                      alt="play a new game"
                      className="w-[3vw] h-auto"
                    />
                    <span className="mr-2 text-xs md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl">
                      새로운 턴
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </ul>
        )}
      </div>
    </>
  );
});

export default ResultsList;
