import cloud1 from "../assets/images/cloud1.svg";
import cloud2 from "../assets/images/cloud2.svg";
import cloud3 from "../assets/images/cloud3.svg";
import cloud4 from "../assets/images/cloud4.svg";
import sun from "../assets/images/sun.svg";

function LoadingPage() {
  return (
    <div className="w-screen h-screen font-bmjua bg-[#E7F5FF] flex flex-col items-center justify-center text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl">
      <h1>태양이가 열심히 그림을 그리고 있어요~</h1>
      <div className="flex">
        <img
          src={cloud1}
          alt="cloud"
          className="relative z-10 w-[21vw] h-[31vh] top-[19vh] left-[8vw]"
        />
        <img
          src={cloud2}
          alt="cloud"
          className="relative z-20 w-[12vw] h-[12vh] top-[19vh] right-[2vw]"
        />
        <img
          src={sun}
          alt="sun"
          className="relative z-0 w-[24vw] h-[49vh] right-[6vw]"
        />
        <img
          src={cloud3}
          alt="cloud"
          className="relative w-[14vw] h-[23vh] right-[8vw] top-[10vh]"
        />
        <img
          src={cloud4}
          alt="cloud"
          className="relative w-[9vw] h-[16vh] right-[22vw] top-[29vh]"
        />
      </div>
      <div className=" mt-[5vh]">PLEASE WAIT...</div>
    </div>
  );
}

export default LoadingPage;
