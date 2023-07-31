import { observer } from "mobx-react";
import { useEffect } from "react";

import shareIcon from "../../assets/images/kakao_share_button.png";
// import shareIcon from "../../assets/images/kakaotalk_sharing_btn.png";
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
      className="border-dashed border-2 border-black rounded-[12px] shadow-lg ml-2 relative z-10 flex justify-center items-center"
    >
      <img
        src={shareIcon}
        alt="카카오톡으로 공유하기"
        className="w-auto h-[6.5vh] max-[768px]:w-[6vh] max-[768px]:h-[6vh] p-[1px]"
      />
    </button>
  );
});

export default KakaoShareButton;
