import { observer } from "mobx-react";
import { useEffect } from "react";

import shareIcon from "../../assets/images/kakao_share_button.png";
import WebsocketStore from "../../stores/WebsocketStore";

const KakaoShareButton = observer(() => {
  const { gameResult } = WebsocketStore;
  const correctAnswer = gameResult[0].title;

  const createKakaoButton = () => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      if (!kakao.isInitialized()) {
        kakao.init(process.env.VITE_APP_KAKAO_API_KEY?.replace(/"/g, "") || "");
      }

      kakao.Share.createDefaultButton({
        container: "#kakaotalk-sharing-btn",
        objectType: "list",
        headerTitle: `제시어 : ${correctAnswer}`,
        headerLink: {
          mobileWebUrl: "https://www.relaysketch.online/",
          webUrl: "https://www.relaysketch.online/",
        },
        contents: gameResult.map((result) => ({
          title: result.title,
          description: result.player_name,
          imageUrl: result.img,
          link: {
            mobileWebUrl: result.img,
            webUrl: result.img,
          },
        })),
        buttonTitle: "나도 게임 해보기",
      });
    }
  };

  useEffect(() => {
    createKakaoButton();
  }, []);

  return (
    <button
      id="kakaotalk-sharing-btn"
      type="button"
      className="border-dashed border-2 border-black rounded-[25px] bg-[#E7F5FF] shadow-lg mr-2 p-2 relative z-10 flex justify-center items-center"
    >
      <img
        src={shareIcon}
        alt="카카오톡으로 공유하기"
        className="w-[3vw] h-[6vh] max-[768px]:w-[6vh] max-[768px]:h-[6vh]"
      />
    </button>
  );
});

export default KakaoShareButton;
