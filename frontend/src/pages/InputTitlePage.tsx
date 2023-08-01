import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import 햇님 from "../assets/images/햇님.svg";
import Background from "../components/Background";
import WebsocketStore from "../stores/WebsocketStore";

const InputTitlePage = observer(() => {
  const { nowLoading, error } = WebsocketStore;
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
    if (nowLoading) {
      navigate("/loading");
    }
  }, [nowLoading]);

  useEffect(() => {
    if (error) {
      window.location.href = "/";
    }
  }, [error]);

  return (
    <Background title="주제를 입력하세요!">
      <img
        src={햇님}
        alt="sun"
        className="w-[500px] h-[400px] mx-auto relative z-40 ml-20 pb-10 p-4"
      />
    </Background>
  );
});

export default InputTitlePage;
