import cloud1 from "../assets/images/cloud1.svg";
import cloud2 from "../assets/images/cloud2.svg";
import cloud3 from "../assets/images/cloud3.svg";
import cloud4 from "../assets/images/cloud4.svg";
import sun from "../assets/images/sun.svg";

function LoadingPage() {
  return (
    <div className="w-full h-full font-bmjua bg-[#E7F5FF] flex flex-col items-center justify-center text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl">
      <h1>태양이가 열심히 그림을 그리고 있어요~</h1>
      <div className="flex">
        <img
          src={cloud1}
          alt="cloud image"
          className="relative z-10 w-[20.83333vw] h-[31.48346vh] top-[19.21025vh] left-[8.33333vw]"
        />
        <img
          src={cloud2}
          alt="cloud image"
          className="relative z-20 w-[12.29167vw] h-[11.7396vh] top-[19.21025vh] right-[1.82291vw]"
        />
        <img
          src={sun}
          alt="sun image"
          className="relative z-0 w-[23.95833vw] h-[49.09284vh] right-[6.25vw]"
        />
        <img
          src={cloud3}
          alt="cloud image"
          className="relative w-[14.0625vw] h-[22.94557vh] right-[7.8125vw] top-[9.60512vh]"
        />
        <img
          src={cloud4}
          alt="cloud image"
          className="relative w-[8.85417vw] h-[16.00853vh] right-[21.61458vw] top-[28.81537vh]"
        />
      </div>
      <div className=" mt-[5.33618vh]">PLEASE WAIT...</div>
    </div>
  );
}

export default LoadingPage;
