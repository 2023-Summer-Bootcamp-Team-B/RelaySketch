import { observer } from "mobx-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import invite from "../assets/images/invite_link.svg";
import play from "../assets/images/play.svg";
import sketch from "../assets/images/sketch_book_white.svg";
import small_border from "../assets/images/small_box_border.svg";
import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import cloud3 from "../assets/images/구름3.svg";
import WebsocketStore from "../stores/WebsocketStore";

type ArrType = { id: number; empty: boolean };
const PlayerRoomPage = observer(() => {
  console.log("Rendering PlayerRoomPage");
  const navigate = useNavigate();
  const param = useParams();
  const { round, send, error } = WebsocketStore;
  const prevRound = 0;
  const arr1 = [
    { id: 1, empty: false },
    { id: 2, empty: false },
    { id: 3, empty: false },
    { id: 4, empty: false },
    { id: 5, empty: false },
    { id: 6, empty: true },
  ];
  const connect = useCallback(() => {
    console.log("Connecting to websocket");
    WebsocketStore.connect(`ws://15.165.125.132/ws/room/${param.id}/`);
  }, [param.id]);
  useEffect(() => {
    connect();
  }, []);
  useEffect(() => {
    if (prevRound !== round) {
      navigate("/input");
    }
  }, [round]);
  const [, setContent] = useState("클릭하여 내용을 편집하세요.");
  const handleContentChange = (event: any) => {
    setContent(event.target.textContent);
    send(event.target.textContent);
  };
  const gameStart = () => {
    send({ event: "startGame", data: "게임 시작" });
  };
  if (error) {
    navigate("/");
  }
  return (
    <div className="relative h-screen w-screen bg-[#E7F5FF] flex justify-center items-center overflow-hidden">
      <img src={sketch} alt="sketch" className="absolute z-10 pb-[60px]" />
      <div className="grid grid-cols-2 grid-rows-3 mb-8 w-[650px] h-[400px] mt-[10px] ">
        {arr1.map((x: ArrType) =>
          x.empty ? (
            <div
              className="relative z-20 w-[300px] h-[100px] items-center justify-center mt-8 ml-4"
              key={x.id}
            >
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />
              <p className="absolute z-30  ml-[90px] mt-[28px] font-hs text-[40px]">
                EMPTY
              </p>
              <div className="absolute bg-gray-400 z-39 h-[100%] w-[92%] top-2 left-2.5" />
            </div>
          ) : (
            <div
              className="relative z-20 w-[300px] h-[100px] items-center justify-center mt-8 ml-4"
              key={x.id}
            >
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />
              <p
                className="absolute z-30  ml-[70px] mt-[28px] font-hs text-[40px]"
                onChange={handleContentChange}
              >
                PLAYER{x.id}
              </p>
              <div className="absolute bg-[#E7F5FF] z-39 h-[98%] w-[91%] top-2 left-2.5" />
            </div>
          )
        )}
        <button className="relative" type="button">
          <div className="absolute flex items-center justify-center ml-[120px] z-20 w-[190px] h-[65px] top-[90px]">
            <img
              src={small_border}
              alt="small_border"
              className="absolute z-30"
            />
            <img
              src={invite}
              alt="invite"
              className="absolute z-30 mt-1 ml-4 left-0 w-[40px] h-auto"
            />
            <span className="absolute z-30 ml-[50px] font-hs text-[40px]">
              Link
            </span>
            <div className="absolute bg-white z-39 h-[96%] w-[91%] top-0.5" />
          </div>
        </button>
        <button className="relative" type="button" onClick={gameStart}>
          <div className="absolute flex items-center justify-center ml-[20px] z-20 w-[190px] h-[65px] top-[90px] ">
            <img
              src={small_border}
              alt="small_border"
              className="absolute z-30 w-full h-auto"
            />
            <img
              src={play}
              alt=""
              className="absolute z-30 mt-1 ml-2 left-0 w-[60px] h-auto"
            />
            <p className="absolute z-30  ml-[50px] font-hs text-[40px]">
              Start
            </p>
            <div className="absolute bg-white z-39 h-[96%] w-[91%] top-0.5" />
          </div>
        </button>
        <div className="">
          <img
            src={cloud1}
            alt="cloud1"
            className="absolute z-0 bottom-96 w-96 right-[200px] animate-slider_left"
          />
        </div>
        <div>
          <img
            src={cloud3}
            alt="cloud3"
            className="absolute z-0 top-10 right-[200px] animate-slider_left_invisible"
          />
        </div>
        <div>
          <img
            src={cloud1}
            alt="cloud1"
            className="absolute z-0 left-[200px] bottom animate-slider_right"
          />
        </div>
        <div>
          <img
            src={cloud2}
            alt="cloud2"
            className="absolute z-0 left-[200px] animate-slider_right"
          />
        </div>
      </div>
    </div>
  );
});
export default PlayerRoomPage;
