import { observer } from "mobx-react";
import React, { useState, useEffect, useRef } from "react";

import 구름1 from "../assets/images/구름1.svg";
import 구름2 from "../assets/images/구름2.svg";
import 구름3 from "../assets/images/구름3.svg";
import 버튼테두리1 from "../assets/images/버튼테두리1.svg";
import 인원수테두리 from "../assets/images/인원수테두리.svg";
import 입력창테두리 from "../assets/images/입력창테두리.svg";
import 체크 from "../assets/images/체크.svg";
import WebsocketStore from "../stores/WebsocketStore";

type BackgroundProps = {
  children: React.ReactNode;
  title: string;
};

const Background = observer(({ children, title }: BackgroundProps) => {
  const [clickEditButton, setClickEditButton] = useState(false); // changeTitle
  const [input, setInput] = useState("");
  const [clickInputButton, setClickInputButton] = useState(true);
  const [timer, setTimer] = useState(30);
  const timerDisplayRef = useRef<HTMLSpanElement>(null);
  const { completeNum, total, myId } = WebsocketStore;

  useEffect(() => {
    if (timerDisplayRef.current) {
      timerDisplayRef.current.innerText = timer.toString();
    }
  }, [timer]);

  const onTimerEnd = () => {
    console.log("Timer ended! Perform your specific event here.");
    // 0초가 됐을 때 강제 라운드 변경 이벤트
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input field value
    setInput(e.target.value);
  };

  const handleButtonClick = () => {
    if (clickInputButton) {
      setClickInputButton(false);
    }
    setClickEditButton(true);

    WebsocketStore.sendDataToBackend(input, myId, clickEditButton); // Replace 'input' with the data you want to send
    console.log("Button clicked!");
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
        <div className="flex pt-10 relative">
          <span className="text-[82px] ">1/4</span>
          <span className="text-[56px] mx-auto mt-3 pl-12 absolute ml-[230px]">
            {title}
          </span>
          <span
            ref={timerDisplayRef}
            className="text-[82px] z-40 px-5 absolute ml-[850px]"
          />
        </div>
        <div className="flex relative">
          <div className="relative w-[180px] h-20">
            <div className="flex items-center bg-white w-[178px] h-[76px] pl-3">
              <img src={체크} alt="check" className=" w-[54px] bottom-7 z-40" />
              <span className="text-[50px] flex px-2 z-40">
                {completeNum}/{total}
              </span>
            </div>
            <img
              src={인원수테두리}
              alt="playerline"
              className="absolute bottom-[2px]"
            />
          </div>
          {children}
          <div className="absolute flex w-72 h-auto">
            <img
              src={구름2}
              alt="cloud2"
              className="relative left-12 z-20 top-36"
            />
            <img
              src={구름1}
              alt="cloud1 "
              className="relative top-56 right-40"
            />
            <img
              src={구름1}
              alt="cloud1"
              className=" z-5 top-40 left-40 relative"
            />
            <img src={구름3} alt="cloud2" className=" z-10 relative left-4" />
          </div>
        </div>

        <div className="relative w-auto flex mt-2 mb-6 justify-center mx-auto ml-16">
          <div className="w-[600px] h-[140px]">
            <img
              src={입력창테두리}
              alt="input"
              className=" absolute w-[590px] h-[335px] bottom-[-75px] left-[75px] z-20"
            />
            <input
              className=" w-[570px] h-[100px] text-[42px] absolute pl-6 ml-3 z-30 outline-none"
              type="text"
              value={input}
              onChange={handleInput} // 입력창
            />
          </div>

          <div className=" relative w-[188px]">
            <img
              src={버튼테두리1}
              alt="buttonline"
              className=" absolute bottom-[27px] left-[-5px] w-auto h-[127px] z-20"
            />
            {clickInputButton ? (
              <button
                className="text-[42px] px-6 z-30 py-[12px] h-[100px] absolute"
                type="submit"
                onClick={handleButtonClick}
              >
                입력
              </button>
            ) : (
              <button
                className="text-[42px] px-6 z-30 py-[12px] h-[100px] absolute"
                type="submit"
                onClick={handleButtonClick}
              >
                수정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Background;
