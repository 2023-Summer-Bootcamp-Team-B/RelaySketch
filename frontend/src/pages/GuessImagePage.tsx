import { observer } from "mobx-react";
import { useState } from "react";

// import AI이미지 from "../assets/images/AI이미지.svg";
import 스케치북테두리 from "../assets/images/스케치북테두리.svg";
import Background from "../components/Background";
import WebsocketStore from "../stores/WebsocketStore";

const GuessImagePage = observer(() => {
  const { round, total, imgSrc } = WebsocketStore;
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
          round={round}
          total={total}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
        >
          <img
            src={스케치북테두리}
            alt="sketchline"
            className=" w-[500px] h-[400px] z-40 relative mx-auto ml-[80px] pb-10"
          />
          <img
            src={imgSrc}
            alt="aiimage"
            className="bg-white w-[450px] h-[300px] z-10 absolute mx-auto right-[275px] top-[50px]"
          />
        </Background>
      </div>
    </div>
  );
});

export default GuessImagePage;
