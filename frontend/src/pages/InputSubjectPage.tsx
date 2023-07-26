import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import 햇님 from "../assets/images/햇님.svg";
import Background from "../components/Background";
import WebsocketStore from "../stores/WebsocketStore";

const InputSubjectPage = observer(() => {
  const { nowLoading } = WebsocketStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (nowLoading) {
      navigate("/loading");
    }
  }, [nowLoading]);

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

export default InputSubjectPage;
