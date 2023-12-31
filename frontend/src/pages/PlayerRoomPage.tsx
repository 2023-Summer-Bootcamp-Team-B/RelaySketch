/* eslint-disable no-param-reassign */

import { observer } from "mobx-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import crown from "../assets/images/crown.png";
import invite from "../assets/images/invite_link.svg";
import new_button from "../assets/images/new_button.png";
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
  const {
    myId,
    players: player,
    total,
    hostId,
    round,
    disconnect,
  } = WebsocketStore;

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

  useEffect(() => {
    // Add event listener for beforeunload
    window.onbeforeunload = () => {
      window.location.href = "/";
      disconnect();
      // The return value is ignored, but we need to return something to trigger the event
      return null;
    };
    return () => {
      // Remove the event listener when component unmounts
      window.onbeforeunload = null;
    };
  }, []);

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const name = defaultName(myId);

    if (inputValue.length <= 1 || inputValue.length >= 6) {
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
  };

  const handleCopyLinkToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        SetValueState("초대 링크가 복사 되었어요!");
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
    roomstate[i].empty = false;
    roomstate[i].playerId = player[i].player_id;
    roomstate[i].playerName = player[i].name;
  }

  const connect = useCallback(() => {
    WebsocketStore.connect(`wss://www.relaysketch.online/ws/room/${param.id}/`);
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
        SetValueState("동일한 닉네임이 존재해요!");
        SetHintState("닉네임은 오직 하나여야만 해요.");
        SetismodalEOpen(true);
        return;
      }

      if (inputValue.length <= 1) {
        SetValueState("닉네임을 입력하세요!");
        SetHintState("need 1~5 char");
        SetismodalEOpen(true);
        return;
      }
      if (inputValue.length >= 6) {
        SetValueState("닉네임이 너무 길어요!");
        SetHintState("need 1~5 char");
        SetismodalEOpen(true);
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

  useEffect(() => {
    if (error) {
      alert(error);
      window.location.href = "/";
    }
  }, [error]);

  return (
    <div className="relative h-screen w-screen bg-[#E7F5FF] flex justify-center items-center overflow-hidden">
      <img src={sketch} alt="sketch" className="absolute z-10 pb-[60px]" />
      <div className="grid grid-cols-2 grid-rows-3 mb-8 sm:w-[650px] sm:h-[400px] w-[320px] h-[220px] sm:mt-[10px] mt-[-40px] sm:mr-0 mr-6">
        {roomstate.map((x: ArrType) =>
          x.empty ? (
            <div
              className="relative z-20 sm:w-[300px] sm:h-[100px] w-[150px] h-[50px] items-center justify-center mt-8 ml-4"
              key={x.index}
            >
              <img
                src={small_border}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />
              <p className="absolute z-30  sm:ml-[90px] ml-[44px] sm:mt-[28px] mt-[10px] font-hs sm:text-[40px] text-[20px]">
                EMPTY
              </p>
              <div className="absolute bg-gray-400 z-39 h-[100%] w-[92%] top-2 left-2.5 sm:ml-0 sm:mt-0 ml-[-4px] mt-[-4px]" />
            </div>
          ) : (
            <div
              className="relative z-20 w-[150px] h-[50px] mt-8 ml-4 sm:w-[300px] sm:h-[100px]"
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
                  className="absolute w-10 h-10 z-40 sm:bottom-[80px] bottom-[38px]"
                />
              )}

              <div className="absolute z-30  sm:ml-[12px] ml-[7px] mt-[9px] font-hs sm:text-[40px] text-[20px]">
                {x.playerId === myId ? (
                  <input
                    className="absolute z-29 sm:ml-0 ml-[-2px] sm:w-[272px] sm:h-[94px] w-[138px] h-[45px] bg-[#7EC8FF] sm:mt-[1px] mt-[-3px] text-center rounded-[5px] ring-2 ring-black border-2 border-[#010101]"
                    defaultValue={x.playerName}
                    onKeyDown={handleInputKeyDown}
                    onBlur={handleInputBlur}
                  />
                ) : (
                  <span className="absolute sm:w-[271px] sm:h-[95px] w-[134px] h-[45px] bg-[#E7F5FF] sm:mt-0 mt-[-3px] flex items-center justify-center">
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
          <div className="absolute flex items-center justify-center sm:ml-[120px] ml-[-20px] z-20 w-[190px] h-[65px] top-[90px]">
            <img
              src={new_button}
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
            <div className="absolute z-39 h-[96%] w-[91%] top-0.5" />
          </div>
        </button>

        {myId === hostId ? (
          <button className="relative" type="button" onClick={handlePlay}>
            <div className="absolute flex items-center justify-center ml-[20px] z-20 w-[190px] h-[65px] top-[90px] ">
              <img
                src={new_button}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />

              <img
                src={play}
                alt="play button"
                className="absolute z-30 mt-1 ml-2 left-0 w-[60px] h-auto"
              />

              <p className="absolute z-30  ml-[50px] font-hs text-[40px] ">
                시작
              </p>
              <div className="absolute z-39 h-[96%] w-[91%] top-0.5" />
            </div>
          </button>
        ) : (
          <button className="relative" type="button">
            <div className="absolute flex items-center justify-center ml-[20px] z-20 w-[190px] h-[65px] top-[90px] ">
              <img
                src={new_button}
                alt="small_border"
                className="absolute z-30 w-full h-auto"
              />

              <p className="absolute z-30  ml-[10px] font-hs text-[40px]">
                준비중..
              </p>
              <div className="absolute bg-gray z-39 h-[96%] w-[91%] top-0.5" />
            </div>
          </button>
        )}

        <div>
          <img
            src={cloud1}
            alt="cloud1"
            className="absolute z-0 bottom-96 right-[200px] animate-slider_left w-[600px] h-auto"
          />
        </div>
        <div>
          <img
            src={cloud3}
            alt="cloud3"
            className="absolute z-0 top-10 right-[200px] w-[300px] h-auto animate-slider_left_invisible"
          />
        </div>
        <div>
          <img
            src={cloud1}
            alt="cloud1"
            className="absolute z-0 left-[200px] w-[500px] h-auto bottom animate-slider_right"
          />
        </div>
        <div>
          <img
            src={cloud2}
            alt="cloud2"
            className="absolute z-0 left-[200px] w-[300px] h-auto animate-slider_right"
          />
        </div>
      </div>
      {IsmodalEOpen && <ModalTextError />}
    </div>
  );
});

export default PlayerRoomPage;
