/* eslint-disable no-param-reassign */
import { observer } from "mobx-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import crown from "../assets/images/crown.png";
import invite from "../assets/images/invite_link.svg";
import play from "../assets/images/play.svg";
import sketch from "../assets/images/sketch_book_white.svg";
import small_border from "../assets/images/small_box_border.svg";
import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import cloud3 from "../assets/images/구름3.svg";
import WebsocketStore from "../stores/WebsocketStore";

type ArrType = {
  index: number;
  empty: boolean;
  playerId: number;
  playerName: string;
};

const PlayerRoomPage = observer(() => {
  const { myId, players: player, total, hostId, round } = WebsocketStore;

  console.log("Rendering PlayerRoomPage");
  const navigate = useNavigate();
  const param = useParams();
  const { send, error } = WebsocketStore;
  const [IsmodalEOpen, SetismodalEOpen] = useState(false);
  const [ValueLengthState, SetValueState] = useState("");
  const [HintState, SetHintState] = useState("");
  const prevRound = 0;

  const roomstate = [
    { index: 1, empty: false, playerId: 0, playerName: "" },
    { index: 2, empty: true, playerId: 0, playerName: "" },
    { index: 3, empty: true, playerId: 0, playerName: "" },
    { index: 4, empty: true, playerId: 0, playerName: "" },
    { index: 5, empty: true, playerId: 0, playerName: "" },
    { index: 6, empty: true, playerId: 0, playerName: "" },
  ];

  const defaultName = (Id: number) =>
    `플레이어 ${
      roomstate[roomstate.findIndex((item) => item.playerId === Id)].index
    }`;

  const ModalTextError = () => (
    <div className="fixed top-5  z-30 ">
      <div className="modal-content w-[500px] h-[100px] bg-white flex items-center justify-center rounded-full border-4 border-[#020202] opacity-90">
        <p className="font-hs text-3xl text-center">
          {ValueLengthState}!
          <br />
          {HintState}
        </p>
      </div>
    </div>
  );

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const name = defaultName(myId);

    if (inputValue.length <= 2 || inputValue.length >= 9) {
      SetismodalEOpen(false);
      event.target.value = name;

      send({
        event: "nameChanged",
        data: { playerId: myId, name },
      });
    } else {
      send({
        event: "nameChanged",
        data: { playerId: myId, name: inputValue },
      });
    }
  };

  const handlePlay = () => {
    send({
      event: "startGame",
      data: "게임시작",
    });
    console.log("게임시작!!");
  };

  const handleCopyLinkToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        SetValueState("Link Copied!");
        SetHintState("");
        SetismodalEOpen(true);
        setTimeout(() => {
          SetismodalEOpen(false);
        }, 3000);
      })
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .catch((error) => {
        console.error("Failed to copy link: ", error);
      });
  };

  for (let i = 0; i < total; i += 1) {
    console.log(`방장님 id: ${hostId}`);
    roomstate[i].empty = false;
    roomstate[i].playerId = player[i].player_id;
    roomstate[i].playerName = player[i].name;
    console.log(`${i}번째 아이디: ${roomstate[i].playerId}`);
    console.log(`${i}번째 이름: ${roomstate[i].playerName}`);
  }

  const connect = useCallback(() => {
    console.log("Connecting to websocket");
    WebsocketStore.connect(`ws://localhost:8000/ws/room/${param.id}/`);
  }, [param.id]);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (prevRound !== round) {
      navigate("/input");
    }
  }, [round]);

  const handleInputKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      const inputValue = event.target.value;

      if (
        roomstate.findIndex(
          (item) => !(item.playerId === myId) && item.playerName === inputValue,
        ) !== -1
      ) {
        SetValueState("This text is too Many");
        SetHintState("name can`t be duplicated");
        SetismodalEOpen(true);
        return;
      }

      if (inputValue.length <= 2) {
        SetValueState("This text is too Short");
        SetHintState("need 2~8 char");
        SetismodalEOpen(true);

        return;
      }
      if (inputValue.length >= 9) {
        SetValueState("This text is too Long");
        SetismodalEOpen(true);
        SetHintState("need 2~8 char");
        return;
      }

      SetismodalEOpen(false);

      send({
        event: "nameChanged",
        data: { playerId: myId, name: inputValue },
      });

      event.target.blur();
    }
  };

  if (error) {
    navigate("/");
  }

  return (
    <div className="relative h-screen w-screen bg-[#E7F5FF] flex justify-center items-center overflow-hidden">
      <img src={sketch} alt="sketch" className="absolute z-10 pb-[60px]" />
      <div className="grid grid-cols-2 grid-rows-3 mb-8 w-[650px] h-[400px] mt-[10px] ">
        {roomstate.map((x: ArrType) =>
          x.empty ? (
            <div
              className="relative z-20 w-[300px] h-[100px] items-center justify-center mt-8 ml-4"
              key={x.index}
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
              className="relative z-20 w-[300px] h-[100px]   mt-8 ml-4"
              key={x.index}
            >
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />
              {x.playerId === hostId && (
                <img
                  src={crown}
                  alt="room owner"
                  className="absolute w-10 h-10 z-40 bottom-[80px]"
                />
              )}

              <div className="absolute z-30  ml-[12px] mt-[9px] font-hs text-[40px]">
                {x.playerId === myId ? (
                  <input
                    className="absolute z-29 w-[272px] h-[94px] bg-[#7EC8FF]  mt-[1px] text-center  rounded-[5px] ring-2 ring-black border-2 border-[#010101]"
                    defaultValue={x.playerName}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                  />
                ) : (
                  <span className="absolute w-[271px] h-[95px] bg-[#E7F5FF] flex items-center justify-center">
                    {x.playerName}
                  </span>
                )}
              </div>
            </div>
          ),
        )}
        <button
          className="relative"
          type="button"
          onClick={handleCopyLinkToClipboard}
        >
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
              초대
            </span>
            <div className="absolute bg-white z-39 h-[96%] w-[91%] top-0.5" />
          </div>
        </button>

        {myId === hostId ? (
          <button className="relative" type="button" onClick={handlePlay}>
            <div className="absolute flex items-center justify-center ml-[20px] z-20 w-[190px] h-[65px] top-[90px] ">
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />

              <img
                src={play}
                alt="play button"
                className="absolute z-30 mt-1 ml-2 left-0 w-[60px] h-auto"
              />

              <p className="absolute z-30  ml-[50px] font-hs text-[40px]">
                시작
              </p>
              <div className="absolute bg-white z-39 h-[96%] w-[91%] top-0.5" />
            </div>
          </button>
        ) : (
          <button className="relative" type="button">
            <div className="absolute flex items-center justify-center ml-[20px] z-20 w-[190px] h-[65px] top-[90px] ">
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />

              <p className="absolute z-30  ml-[10px] font-hs text-[40px]">
                Ready..
              </p>
              <div className="absolute bg-gray z-39 h-[96%] w-[91%] top-0.5" />
            </div>
          </button>
        )}

        <div>
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
      {IsmodalEOpen && <ModalTextError />}
    </div>
  );
});

export default PlayerRoomPage;
