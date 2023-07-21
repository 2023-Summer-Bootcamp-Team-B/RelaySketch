import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import AnimatedBackground from "../components/UI/AnimatedBackground";
import AnimatedFooter from "../components/UI/AnimatedFooter";
import WebsocketStore from "../stores/WebsocketStore";

const LoadingPage = observer(() => {
  const { nowLoading } = WebsocketStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (!nowLoading) {
      navigate("/guess");
    }
  }, [nowLoading]);

  return (
    <div className="w-screen h-screen font-hs bg-[#E7F5FF] text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl">
      <div className="container translate-x-1/2 translate-y-1/2 fixed bottom-1/2 right-1/2 flex flex-col items-center justify-center">
        <Header className="mb-14">태양이가 열심히 그림을 그리고 있어요~</Header>
        <AnimatedBackground />
        <AnimatedFooter />
      </div>
    </div>
  );
});

export default LoadingPage;
