import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import 햇님 from "../assets/images/햇님.svg";
import Background from "../components/Background";
import WebsocketStore from "../stores/WebsocketStore";

const InputTitlePage = observer(() => {
  const { nowLoading } = WebsocketStore;
  const navigate = useNavigate();

  return (
    <Background title="주제를 입력하세요!">
      <img
        src={햇님}
        alt="sun"
        className="sm:w-[500px] sm:h-[400px] w-[350px] h-[250px] mx-auto relative z-40 sm:ml-20  ml-[155px] pb-10 sm:mt-0 mt-[10px] p-4"
      />
    </Background>
  );
});

export default InputTitlePage;
