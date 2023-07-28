import axios from "axios";
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
  const { disconnect } = WebsocketStore;
  const navigate = useNavigate();
  const handleClickConnect = async () => {
    try {
      const res = await axios.post("http://localhost/api/add_room/");
      navigate(`/playerroom/${res.data.result.room_id}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    debounce(async () => {
      try {
        disconnect();
        const res = await axios.post("http://localhost/api/add_room/");
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
            className="z-50 transform w-[210px] h-auto mr-[490px] mb-[210px] animate-wiggle"
            alt="backgroundsun"
          />
          <div className="absolute inset-0 flex items-center justify-center pt-5 z-2 w-auto h-auto ">
            <p className="text-center transform -translate-y-[70px] font-hs text-[110px]">
              RELAY
            </p>
            <p className="absolute text-center transform translate-y-[60px] font-hs text-[110px]">
              SKETCH
            </p>

            <div className="absolute inset-0 flex items-center justify-center duration-75 transform translate-y-[180px] scale-1 z-2 animate-pulse">
              <span className="text-[40px] font-hs mb-3 whitespace-nowrap">
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
