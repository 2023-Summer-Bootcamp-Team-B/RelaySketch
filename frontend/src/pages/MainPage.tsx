import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import sketch from "../assets/images/sketch_book_white.svg";
import sun from "../assets/images/sun.svg";
import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import WebsocketStore from "../stores/WebsocketStore";

const MainPage = observer(() => {
  const { disconnect, setError, setWs } = WebsocketStore;
  const navigate = useNavigate();

  const csrftoken = Cookies.get("csrftoken");
  const config = {
    headers: {
      "X-CSRFToken": csrftoken,
    },
  };
  const handleClickConnect = async () => {
    try {
      const res = await axios.post(
        "https://www.relaysketch.online/api/add_room/",
        null,
        config
      );
      navigate(`/playerroom/${res.data.result.room_id}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    disconnect();
    setWs(null);
    setError(null);
    debounce(async () => {
      try {
        disconnect();
        const res = await axios.post(
          "https://www.relaysketch.online/api/add_room/",
          null,
          config
        );
        navigate(`/playerroom/${res.data.result.room_id}`);
      } catch (err) {
        console.log(err);
      }
    }, 100);
  }, []);

  return (
    <button
      className="h-screen w-screen bg-[#E7F5FF] overflow-hidden"
      type="submit"
      onClick={handleClickConnect}
    >
      <div className="relative">
        <div className="absolute  w-[500px] left-[708px] top-[380px] animate-slider_left_invisible ">
          <img src={cloud2} alt="cloud 1" className="w-full h-full " />
        </div>

        <div className="absolute  w-[500px] top-20 animate-slider_right">
          <img src={cloud1} alt="cloud 1" className="w-full h-full" />
        </div>

        <div className="absolute w-[500px] left-[708px] translate-y-1/2 translate-x-1/2 top-40 animate-slider_left">
          <img src={cloud1} alt="cloud 1" className="w-full h-full" />
        </div>
      </div>
      <div className="relative flex items-center justify-center h-screen bottom-[30px]">
        <img src={sketch} className="absolute" alt="background" />
        <div className="relative">
          <img
            src={sun}
            className="z-50 transform mr-[240px] w-[85px] h-auto mb-[100px] animate-wiggle sm:w-[210px] sm:mr-[490px] sm:mb-[210px]"
            alt="backgroundsun"
          />
          <div className="absolute inset-0 flex items-center justify-center pt-5 z-2 w-auto h-auto ">
            <p className="text-[55px] mt-14 text-center transform -translate-y-[70px] font-hs sm:text-[110px] sm:mt-0 ">
              RELAY
            </p>
            <p className="text-[55px] absolute mb-16 text-center transform translate-y-[60px] font-hs sm:text-[110px] sm:mb-0">
              SKETCH
            </p>

            <div className="absolute inset-0 flex items-center justify-center duration-75 transform translate-y-[180px] scale-1 z-2 animate-pulse">
              <span className="text-[20px] font-hs mb-40 whitespace-nowrap sm:text-[40px] sm:mb-3 ">
                시작하려면 아무 곳이나 클릭하세요
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
});

export default MainPage;
