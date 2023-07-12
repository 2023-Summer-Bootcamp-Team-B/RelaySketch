import border from "../assets/images/border.png";
import downloadBtnImg from "../assets/images/download.svg";
import playBtnImg from "../assets/images/play.svg";
import sketchBook from "../assets/images/sketchbook.png";
import sunny from "../assets/images/sun.svg";

function ResultsPage() {
  return (
    <div className=" h-screen w-screen flex justify-center items-center font-bmjua bg-[#E7F5FF] ">
      {/* 최외곽 컨테이너 */}
      <div className=" flex">
        {/* 플레이어 목록 테두리 */}
        <div className=" absolute z-10 left-[19vw] bottom-[9vh]">
          <img src={border} alt="" className="w-[17.5vw] h-[77vh]" />
        </div>
        {/* 각 플레이어 항목 테두리들 */}
        <div className=" absolute z-10 left-[20.5vw] top-[22.5vh] ">
          <img src={border} alt="" className="w-[15vw] h-[11vh]" />
        </div>
        <div className=" absolute z-10 left-[20.5vw] top-[34.5vh]">
          <img src={border} alt="" className="w-[15vw] h-[11vh]" />
        </div>
        <div className=" absolute z-10 left-[20.5vw] top-[46vh]">
          <img src={border} alt="" className="w-[15vw] h-[11vh]" />
        </div>
        <div className=" absolute z-10 left-[20.5vw] top-[58vh]">
          <img src={border} alt="" className="w-[15vw] h-[11vh]" />
        </div>
        {/* 스케치북 모음 테두리 */}
        <div className=" absolute z-10 left-[36vw] bottom-[9vh] ">
          <img src={border} alt="" className="w-[46vw] h-[77vh]" />
        </div>
        {/* 플레이어 컨테이너 */}
        <div className=" mr-4 text-center absolute left-[19.8vw] bottom-[14vh] ">
          <div className=" text-3xl md:text-4xl xl:text-5xl ">플레이어</div>
          <div className=" w-[16vw] h-[67vh] flex flex-col items-center text-lg md:text-2xl lg:text-3xl bg-[white] pt-[2vh] overflow-auto">
            {/* 각 플레이어 항목 */}
            <div className=" w-[14vw] h-[10vh] flex justify-center items-center mt-[2vh]">
              <span>플레이어1</span>
            </div>
            <div className=" w-[14vw] h-[10vh] flex justify-center items-center mt-[2vh] bg-[#7EC8FF]">
              <span>플레이어2</span>
            </div>
            <div className=" w-[14vw] h-[10vh] flex justify-center items-center mt-[2vh]">
              <span>플레이어3</span>
            </div>
            <div className=" w-[14vw] h-[10vh] flex justify-center items-center mt-[2vh]">
              <span>플레이어4</span>
            </div>
          </div>
        </div>
        {/* 스케치북 컨테이너 */}
        <div className=" ml-4 absolute left-[37vw] bottom-[14.5vh]">
          {/* 제목 */}
          <div className=" text-3xl md:text-4xl xl:text-5xl text-center mb-4 ">
            플레이어2 님의 스케치북
          </div>
          {/* 앨범 */}
          <div className=" w-[42vw] h-[65vh] overflow-auto p-2 z-10 bg-[white]">
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">Lorem Ipsum</span>
              <span>플레이어2</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img src={sunny} alt="" className=" w-[2vw] h-[4vh] ml-2" />
                <span className="text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39vh]">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28vw] h-[39vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23vw] h-[34vh] relative left-[2.5vw] bottom-[35vh]"
                />
              </div>
            </div>
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">dolor sit</span>
              <span>플레이어1</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img src={sunny} alt="" className=" w-[2vw] h-[4vh] ml-2" />
                <span className=" text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39vh] ">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28vw] h-[39vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23vw] h-[34vh] relative left-[2.5vw] bottom-[35vh]"
                />
              </div>
            </div>
            <div className=" text-right text-lg md:text-2xl mb-4 ">
              <span className="mr-4">Lorem Ipsum</span>
              <span>플레이어3</span>
            </div>
            <div className=" flex items-start mb-4 ">
              <div className=" flex items-center mt-4">
                <img src={sunny} alt="" className=" w-[2vw] h-[4vh] ml-2" />
                <span className="text-lg md:text-2xl ml-1">태양</span>
              </div>
              <div className=" h-[39vh] ">
                <img
                  src={sketchBook}
                  alt=""
                  className=" w-[28vw] h-[39vh] relative z-10"
                />
                <img
                  src=""
                  alt=""
                  className=" w-[23vw] h-[34vh] relative left-[2.5vw] bottom-[35vh]"
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
                  className=" w-[4vw] h-[8vh] p-2"
                />
              </button>
              <button
                type="button"
                className=" border-dashed border-2 border-black rounded-[25px] w-[10vw] h-[8vh] ml-2 text-center bg-[#E7F5FF] shadow-lg flex justify-center items-center"
              >
                <img
                  src={playBtnImg}
                  alt="play a new game"
                  className="w-[2vw] h-[4vh]"
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
