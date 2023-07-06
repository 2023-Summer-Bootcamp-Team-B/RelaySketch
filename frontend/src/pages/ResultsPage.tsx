import downloadBtnImg from "../assets/images/download.svg";
import sunny from "../assets/images/sun.svg";
import border from "../assets/images/border.png";
import sketchBook from "../assets/images/sketchbook.png";
import playBtnImg from "../assets/images/play.svg";

function ResultsPage() {
  return (
    <div className=" h-full w-full flex justify-center items-center font-bmjua bg-[#E7F5FF] ">
      {/* 최외곽 컨테이너 */}
      <div className=" flex">
        {/* 플레이어 목록 테두리 */}
        <div className=" absolute z-10 left-[19.53125vw] bottom-[8.53789vh]">
          <img src={border} alt="" className="w-[17.447917vw] h-[77.05443vh]" />
        </div>
        {/* 각 플레이어 항목 테두리들 */}
        <div className=" absolute z-10 left-[20.57292vw] top-[22.94557vh] ">
          <img src={border} alt="" className="w-[15.36458vw] h-[10.672359vh]" />
        </div>
        <div className=" absolute z-10 left-[20.57292vw] top-[34.68517vh]">
          <img src={border} alt="" className="w-[15.36458vw] h-[10.672359vh]" />
        </div>
        <div className=" absolute z-10 left-[20.57292vw] top-[46.42476vh]">
          <img src={border} alt="" className="w-[15.36458vw] h-[10.672359vh]" />
        </div>
        <div className=" absolute z-10 left-[20.57292vw] top-[58.16435vh]">
          <img src={border} alt="" className="w-[15.36458vw] h-[10.672359vh]" />
        </div>
        {/* 스케치북 모음 테두리 */}
        <div className=" absolute z-10 left-[36.4583vw] bottom-[8.53789vh] ">
          <img src={border} alt="" className="w-[45.9375vw] h-[77.05443vh]" />
        </div>
        {/* 플레이어 컨테이너 */}
        <div className=" mr-4 text-center absolute left-[20.05208vw] bottom-[13.34045vh] ">
          <div className=" text-3xl md:text-4xl xl:text-5xl ">플레이어</div>
          <div className=" w-[16.1458vw] h-[67.2359vh] flex flex-col items-center text-lg md:text-2xl lg:text-3xl bg-[white] pt-[2.13445vh] overflow-auto">
            {/* 각 플레이어 항목 */}
            <div className=" border w-[14.42709vw] h-[9.60512vh] flex justify-center items-center mt-[2.13445vh]">
              <span>플레이어1</span>
            </div>
            <div className=" border w-[14.42709vw] h-[9.60512vh] flex justify-center items-center mt-[2.13445vh] bg-[#7EC8FF]">
              <span>플레이어2</span>
            </div>
            <div className=" border w-[14.42709vw] h-[9.60512vh] flex justify-center items-center mt-[2.13445vh]">
              <span>플레이어3</span>
            </div>
            <div className=" border w-[14.42709vw] h-[9.60512vh] flex justify-center items-center mt-[2.13445vh]">
              <span>플레이어4</span>
            </div>
          </div>
        </div>
        {/* 스케치북 컨테이너 */}
        <div className=" ml-4 absolute left-[37.23958vw] bottom-[13.87407vh]">
          {/* 제목 */}
          <div className=" text-3xl md:text-4xl xl:text-5xl text-center mb-4 ">
            플레이어2 님의 스케치북
          </div>
          {/* 앨범 */}
          <div className=" w-[41.66667vw] h-[64.99466vh] overflow-auto p-2 z-10 bg-[white]">
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">Lorem Ipsum</span>
              <span>플레이어2</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img
                  src={sunny}
                  alt=""
                  className=" w-[2.1875vw] h-[4.26894vh] ml-2"
                />
                <span className="text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39.48773vh]">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28.125vw] h-[39.48773vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23.48958vw] h-[33.9381vh] relative left-[2.34375vw] bottom-[34.68517vh]"
                />
              </div>
            </div>
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">dolor sit</span>
              <span>플레이어1</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img
                  src={sunny}
                  alt=""
                  className=" w-[2.1875vw] h-[4.26894vh] ml-2"
                />
                <span className=" text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39.48773vh] ">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28.125vw] h-[39.48773vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23.48958vw] h-[33.9381vh] relative left-[2.34375vw] bottom-[34.68517vh]"
                />
              </div>
            </div>
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">Lorem Ipsum</span>
              <span>플레이어3</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img
                  src={sunny}
                  alt=""
                  className=" w-[2.1875vw] h-[4.26894vh] ml-2"
                />
                <span className="text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39.48773vh] ">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28.125vw] h-[39.48773vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23.48958vw] h-[33.9381vh] relative left-[2.34375vw] bottom-[34.68517vh]"
                />
              </div>
            </div>
            <div className="text-right text-lg md:text-2xl mb-4">
              <span className="mr-4">consectetur</span>
              <span>플레이어4</span>
            </div>
            <div className=" flex items-center justify-center">
              <button
                type="button"
                className="border-dashed border-2 border-black rounded-[25px] bg-[#E7F5FF] shadow-lg"
              >
                <img
                  src={downloadBtnImg}
                  alt="download button"
                  className=" w-[3.90625vw] h-[8.00427vh] p-2"
                />
              </button>
              <button
                type="button"
                className=" border-dashed border-2 border-black rounded-[25px] w-[10.46875vw] h-[8.00427vh] ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center"
              >
                <img
                  src={playBtnImg}
                  alt="play a new game"
                  className="w-[2.03125vw] h-[4.16222vh]"
                />
                <span className="ml-2 text-xs md:text-sm lg:text-xl xl:text-2xl 2xl:text-3xl">
                  새로운 턴
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
