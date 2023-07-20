import { useState } from "react";

import 햇님 from "../assets/images/햇님.svg";
import Background from "../components/Background";

const InputSubjectPage = () => {
  const [input, setInput] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const handleSubmit = () => {
    console.log("InputSubjectPage에서 편집버튼 누름", input);
  };

  return (
    <Background
      title="주제를 입력하세요!"
      input={input}
      handleInput={handleInput}
      handleSubmit={handleSubmit}
    >
      <img
        src={햇님}
        alt="sun"
        className="w-[500px] h-[400px] mx-auto relative z-40 ml-20 pb-10 p-4"
      />
    </Background>
  );
};

export default InputSubjectPage;
