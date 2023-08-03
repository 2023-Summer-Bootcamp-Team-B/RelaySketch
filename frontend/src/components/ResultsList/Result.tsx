import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { observer } from "mobx-react";
import { useState, useEffect, useCallback } from "react";

import downloadBtnImg from "../../assets/images/download.svg";
import playBtnImg from "../../assets/images/play.svg";
import sketchBook from "../../assets/images/sketchbook.png";
import sunny from "../../assets/images/sun.svg";
import WebsocketStore from "../../stores/WebsocketStore";
import Button from "../UI/Button";
import KakaoShareButton from "../UI/KakaoShareButton";

type ResultPropsType = {
  title: string;
  name: string;
  image: string | undefined;
  index: number;
};

const Result = observer(({ name, title, image, index }: ResultPropsType) => {
  const {
    gameResult,
    currentIdx,
    myId,
    hostId,
    allEnteredPlayers,
    send,
    disconnect,
  } = WebsocketStore;
  const [hidden, setHidden] = useState(true);
  const zip = new JSZip();
  const imgUrlList = gameResult.map((result) => result.img);
  const count = gameResult.length - 1;
  const total = gameResult.length;
  const newGameHandler = () => {
    window.location.href = "/";
    disconnect();
  };
  const downloadHandler = async () => {
    const promises: Promise<any>[] = [];
    Object.entries(imgUrlList).forEach(([i, imgUrl]) => {
      const promise = axios({
        url: imgUrl,
        method: "GET",
        responseType: "arraybuffer",
        withCredentials: false,
      })
        .then(({ data }) => {
          const fileName = `image_${i}.png`;
          zip.file(fileName, data, { binary: true });
        })
        .catch((err) => {
          console.log(err);
        });
      promises.push(promise);
    });
    await Promise.all(promises);
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "images.zip"));
  };
  const showResultHandler = () => {
    const id = allEnteredPlayers[currentIdx].player_id;
    send({ event: "wantResult", data: { playerId: id } });
  };
  const ref = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setHidden(false);
    }, index * 2000);
  }, [gameResult]);
  useEffect(() => {
    setHidden(true);
  }, [gameResult]);
  const classes =
    index === 0
      ? "mr-4 text-[#FC5C65] font-bold"
      : "mr-4 text-[#0984E3] font-bold";
  return (
    <>
      {!hidden && (
        <div ref={ref}>
          <div className=" text-right text-lg md:text-3xl mb-4 mr-2 relative z-10">
            <span className={classes}>{title}</span>
            <span>{name}</span>
          </div>
          <div className=" flex items-start mb-4 ">
            <div className=" flex mt-4 relative z-10 sm:h-[35vh] h-40">
              <img src={sunny} alt="" className=" w-[3vw] h-[5vh] ml-4 " />
              <span className="text-lg md:text-2xl ml-1 mt-2 ">태양</span>
            </div>
            <div className=" sm:h-[39vh] h-[10px]">
              <img
                src={sketchBook}
                alt=""
                className=" sm:w-[28vw] w-[230px] sm:h-[39vh] h-[160px] relative z-20 "
              />
              <img
                src={image}
                alt=""
                className=" sm:w-[23.5vw] w-[194px] z-10 sm:h-[34vh] h-[140px] relative sm:left-[2.3vw] left-[18px] sm:bottom-[35vh] bottom-[144px] "
              />
            </div>
          </div>
          {/* 마지막 결과가 아닌 경우 */}
          {currentIdx !== total && index === count && (
            <div className=" flex items-center justify-center">
              <Button
                type="button"
                className="border-dashed border-2 border-black rounded-[12px] bg-[#E7F5FF] shadow-lg relative z-10"
                onClick={downloadHandler}
              >
                <img
                  src={downloadBtnImg}
                  alt="download button"
                  className=" sm:w-[3.5vw] w-[50px] h-[6.5vh] p-2"
                />
              </Button>
              {/* 방장이 아니면 다음 결과 보기 버튼을 화면에 표시하지 않음 */}
              {myId === hostId && (
                <Button type="button" onClick={showResultHandler}>
                  <div className=" border-dashed border-2 border-black rounded-[12px] w-fit h-[7vh] pl-2 pr-2 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
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
              <KakaoShareButton />
            </div>
          )}
          {/* 마지막 결과인 경우 */}
          {currentIdx === total && index === count && (
            <div className=" flex items-center justify-center">
              <Button
                type="button"
                className="border-dashed border-2 border-black rounded-[12px] bg-[#E7F5FF] shadow-lg relative z-10"
                onClick={downloadHandler}
              >
                <img
                  src={downloadBtnImg}
                  alt="download button"
                  className=" w-[3.5vw] h-[6.5vh] p-2"
                />
              </Button>
              <Button type="button" onClick={newGameHandler}>
                <div className=" border-dashed border-2 border-black rounded-[12px] w-fit h-[7vh] p-4 ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center relative z-10">
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
              <KakaoShareButton />
            </div>
          )}
        </div>
      )}
      <br />
    </>
  );
});
export default Result;
