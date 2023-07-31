/* eslint-disable no-await-in-loop */
import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { observer } from "mobx-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
  const { gameResult, total, currentIdx, myId, hostId, players, send } =
    WebsocketStore;
  const [hidden, setHidden] = useState(true);
  const zip = new JSZip();
  const navigate = useNavigate();
  const imgUrlList = gameResult.map((result) => result.img);
  const count = gameResult.length - 1;

  const newGameHandler = () => {
    navigate("/");
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
    const id = players[currentIdx].player_id;
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

  return (
    <>
      {!hidden && (
        <div ref={ref}>
          <div className=" text-right text-lg md:text-3xl mb-4 mr-2 relative z-10">
            <span className="mr-4">{title}</span>
            <span>{name}</span>
          </div>
          <div className=" flex items-start mb-4 ">
            <div className=" flex mt-4 relative z-10 h-[35vh]">
              <img src={sunny} alt="" className=" w-[3vw] h-[5vh] ml-4 " />
              <span className="text-lg md:text-2xl ml-1 mt-2 ">태양</span>
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
                className=" w-[23.5vw] h-[34vh] relative left-[2.3vw] bottom-[35vh]"
              />
            </div>
          </div>
          {/* 마지막 결과가 아닌 경우 */}
          {currentIdx !== total && index === count && (
            <div className=" flex items-center justify-center">
              <KakaoShareButton />
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
          {currentIdx === total && index === count && (
            <div className=" flex items-center justify-center">
              <KakaoShareButton />
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
        </div>
      )}
      <br />
    </>
  );
});

export default Result;
