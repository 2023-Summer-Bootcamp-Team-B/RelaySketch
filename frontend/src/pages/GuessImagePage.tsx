import { useState } from "react";

import 스케치북배경 from "../assets/images/스케치북배경.svg";
import 스케치북테두리 from "../assets/images/스케치북테두리.svg";
import Background from "../components/Background";

function GuessImagePage() {
  const [input, setInput] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const handleSubmit = () => {
    console.log("GuessImagePage에서 편집버튼 누름", input);
  };
  return (
    <div>
      <div>
        <Background
          title="이미지를 맞혀보세요!"
          input={input}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
        >
          <img
            src={스케치북테두리}
            alt="sketchline"
            className=" w-[500px] h-[400px] z-40 relative mx-auto ml-[80px] pb-10"
          />
          <img
            src={스케치북배경}
            alt="sketchbg"
            className=" w-[450px] h-[350px] z-30 relative mx-auto right-[480px] top-[25px]"
          />
        </Background>
      </div>
    </div>
  );
}

export default GuessImagePage;
