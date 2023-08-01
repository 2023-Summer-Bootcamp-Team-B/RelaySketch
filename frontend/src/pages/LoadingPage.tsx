import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import AnimatedBackground from "../components/UI/AnimatedBackground";
import AnimatedFooter from "../components/UI/AnimatedFooter";
import WebsocketStore from "../stores/WebsocketStore";

const LoadingPage = observer(() => {
  const { nowLoading, endGame, error } = WebsocketStore;
  const navigate = useNavigate();

  const handlePopState = (event: { state: any }) => {
    // event.state는 pushState 또는 replaceState로 변경한 상태 정보를 가지고 있습니다.
    if (event.state) {
      window.location.href = "/";
      console.log("이전 페이지 보기 버튼이 눌렸습니다!");
      // 원하는 작업을 수행합니다.
    } else {
      // 다음 페이지 보기 버튼이 눌렸을 때 처리하는 로직을 작성합니다.
      console.log("다음 페이지 보기 버튼이 눌렸습니다!");
      window.location.href = "/";
    }
  };

  window.addEventListener("popstate", handlePopState);

  useEffect(() => {
    if (!nowLoading) {
      if (!endGame) {
        navigate("/guess");
      } else {
        navigate("/results");
      }
    }
  }, [nowLoading, endGame]);

  useEffect(() => {
    if (error) {
      alert(error);
      window.location.href = "/";
    }
  }, [error]);

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
