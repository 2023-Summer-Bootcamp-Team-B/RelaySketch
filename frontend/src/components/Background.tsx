import { observer } from "mobx-react";
import React, { useState, useEffect, useRef } from "react";

import 구름1 from "../assets/images/구름1.svg";
import 구름2 from "../assets/images/구름2.svg";
import 구름3 from "../assets/images/구름3.svg";
import 버튼테두리1 from "../assets/images/버튼테두리1.svg";
import 인원수테두리 from "../assets/images/인원수테두리1.svg";
import 입력창테두리 from "../assets/images/입력창테두리1.svg";
import 체크 from "../assets/images/체크.svg";
import WebsocketStore from "../stores/WebsocketStore";

type BackgroundProps = {
  children: React.ReactNode;
  title: string;
};

const Background = observer(({ children, title }: BackgroundProps) => {
  const [showButtonB, setShowButtonB] = useState(false);
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(30);
  const timerDisplayRef = useRef<HTMLSpanElement>(null);
  const [, setClickEditButton] = useState(false);
  const [clickInputButton, setClickInputButton] = useState(true);
  const [, setIsSendingChangeTitle] = useState(false);
  const {
    completeNum,
    round,
    total,
    myId,
    resetRound,
    send,
    disconnect,
    error,
    ws,
  } = WebsocketStore;

  useEffect(() => {
    if (timerDisplayRef.current) {
      timerDisplayRef.current.innerText = timer.toString();
    }
  }, [timer]);

  useEffect(() => {
    // Add event listener for beforeunload
    window.onbeforeunload = () => {
      resetRound();
      disconnect();
      window.location.href = "/";
      return null;
    };
    return () => {
      // Remove the event listener when component unmounts
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
      window.location.href = "/";
    }
  }, [error]);

  useEffect(() => {
    if (!ws) {
      alert("서버와의 연결이 끊어졌습니다.");
      window.location.href = "/";
    }
  }, [ws]);

  const onTimerEnd = () => {
    send({
      event: "inputTitle",
      data: {
        title: "스폰지밥",
        playerId: myId,
      },
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input field value
    setInput(e.target.value);
  };

  const handleButtonClickA = () => {
    setClickInputButton(false);
    setClickEditButton(false);
    setShowButtonB(true);
    WebsocketStore.sendDataToBackend(input, myId);
  };

  const handleButtonClickB = () => {
    setIsSendingChangeTitle(true);
    WebsocketStore.sendChangeTitleEvent(input, myId);
    setIsSendingChangeTitle(false); // Set isSendingChangeTitle to false immediately after sending the event
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          onTimerEnd();
          clearInterval(intervalId);
          return 0; // 타이머가 0에 도달하면 0으로 설정 (마이너스 값 안나오게)
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full min-h-screen h-full border m-auto bg-[#E7F5FF] font-hs mx-auto relative flex flex-col items-center overflow-hidden">
      <div
        className=" z-50 w-[1000px] fixed bottom-1/2 right-1/2
      h-660 translate-x-1/2 translate-y-1/2
      transform"
      >
        <div className="flex sm:pt-10 pt-0 relative">
          <span className="sm:text-[82px] text-[35px] sm:ml-0 ml-[320px] ">
            {round}/{total}
          </span>
          <span className="sm:text-[56px] text-[30px] mx-auto sm:mt-3 ml-[355px] pl-12 absolute sm:ml-[255px]">
            {title}
          </span>
          <span
            ref={timerDisplayRef}
            className="sm:text-[82px] text-[40px] z-40 px-5 absolute sm:ml-[850px] ml-[617px] sm:mt-0 mt-[50px]"
          />
        </div>
        <div className="flex relative">
          <div className="relative w-[180px] h-20">
            <div className="flex items-center bg-white w-[178px] h-[76px] pl-3">
              <img
                src={체크}
                alt="check"
                className=" sm:ml-0 ml-[315px] sm:w-[54px] w-[30px] sm:mt-0 mt-[-16px] bottom-7 z-40"
              />
              <span className="sm:text-[50px] text-[25px] flex px-2 z-40 sm:ml-0 ml-[-5px] sm:mt-0 mt-[-20px]">
                {completeNum}/{total}
              </span>
            </div>
            <img
              src={인원수테두리}
              alt="playerline"
              className="absolute sm:bottom-[2px] bottom-[30px] sm:ml-0 ml-[320px] sm:w-[180px] w-[90px]"
            />
          </div>
          {children}
          <div className="absolute flex w-72 h-auto">
            <img
              src={구름2}
              alt="cloud2"
              className="relative sm:left-12 left-[175px] z-20 sm:top-36 top-[30px]"
            />
            <img
              src={구름1}
              alt="cloud1 "
              className="relative sm:top-56 top-[90px] sm:right-40 right-[80px]"
            />
            <img
              src={구름1}
              alt="cloud1"
              className=" z-5 sm:top-40 top-[70px] sm:left-40 left-[80px] relative"
            />
            <img
              src={구름3}
              alt="cloud2"
              className=" z-10 relative sm:left-4"
            />
          </div>
        </div>

        <div className="relative w-auto flex mt-2 mb-6 justify-center mx-auto ml-16">
          <div className="w-[600px] h-[140px]">
            <img
              src={입력창테두리}
              alt="input"
              className=" absolute sm:w-[590px]  w-[290px]  sm:h-[325px]  h-[90px]  sm:bottom-[-72px] bottom-[70px] sm:left-[75px] left-[260px] z-20"
            />
            <input
              className=" sm:w-[570px] w-[282px] sm:h-[100px] h-[50px] text-[20px] sm:text-[42px] absolute sm:pl-6 pl-3 sm:ml-3 ml-[190px] z-30 outline-none"
              type="text"
              value={input}
              onChange={handleInput} // 입력창
            />
          </div>

          <div className=" relative w-[188px]">
            <img
              src={버튼테두리1}
              alt="buttonline"
              className="absolute sm:bottom-[24px] bottom-[83px] sm:left-[-5px] left-[-115px] w-auto sm:h-[127px] h-[60px] z-20"
            />
            {clickInputButton ? (
              <button
                className="sm:text-[42px] text-[20px] sm:mt-2 mt-0 px-6 z-30 py-[12px] sm:left-0 left-[-125px] h-[50px] absolute"
                type="submit"
                onClick={handleButtonClickA}
              >
                입력
              </button>
            ) : null}
            {showButtonB ? (
              <button
                className="sm:text-[42px] text-[20px] sm:left-0 left-[-125px] px-6 z-30 py-[12px] sm:h-[100px] h-[50px] absolute"
                type="submit"
                onClick={handleButtonClickB}
              >
                수정
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Background;
