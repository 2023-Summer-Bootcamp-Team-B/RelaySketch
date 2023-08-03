import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import 스케치북테두리 from "../assets/images/스케치북테두리.svg";
import Background from "../components/Background";
import WebsocketStore from "../stores/WebsocketStore";

const GuessImagePage = observer(() => {
  const {
    nowLoading,
    imgSrc,
    endGame,
    error,
    disconnect,
    setDisableNowLoading,
    resetRound,
  } = WebsocketStore;
  const navigate = useNavigate();

  useEffect(() => {
    // Add event listener for beforeunload
    window.onbeforeunload = () => {
      setDisableNowLoading();
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
    if (nowLoading) {
      navigate("/loading");
    } else if (endGame) {
      navigate("/results");
    }
  }, [nowLoading, endGame]);

  useEffect(() => {
    if (error) {
      alert(error);
      window.location.href = "/";
    }
  }, [error]);

  return (
    <div>
      <div>
        <Background title="이미지를 맞혀보세요!">
          <img
            src={스케치북테두리}
            alt="sketchline"
            className="sm:w-[500px] sm:h-[400px] w-[350px] h-[250px] z-50 relative mx-auto sm:ml-[80px] ml-[155px] sm:mt-0 mt-[50px] pb-10"
          />
          <img
            src={imgSrc}
            alt="aiimage"
            className="bg-white sm:w-[450px] sm:h-[315px] w-[260px] h-[180px] z-40 absolute mx-auto sm:right-[275px] right-[365px] sm:top-[40px] top-[75px]"
          />
        </Background>
      </div>
    </div>
  );
});

export default GuessImagePage;
