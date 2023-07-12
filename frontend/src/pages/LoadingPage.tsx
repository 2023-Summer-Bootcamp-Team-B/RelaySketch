import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import cloud3 from "../assets/images/구름3.svg";
import sun from "../assets/images/햇님.svg";

function LoadingPage() {
  return (
    <div className="w-screen h-screen font-bmjua bg-[#E7F5FF] text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl">
      <div className="container translate-x-1/2 translate-y-1/2 transform fixed bottom-1/2 right-1/2 flex flex-col items-center justify-center">
        <div className="mb-10">
          <span className="relative animate-[animeTextup_1500ms_infinite_100ms]">
            태양이가
          </span>{" "}
          <span className="relative animate-[animeTextup_1500ms_infinite_200ms]">
            열심히
          </span>{" "}
          <span className="relative animate-[animeTextup_1500ms_infinite_300ms]">
            그림을
          </span>{" "}
          <span className="relative animate-[animeTextup_1500ms_infinite_400ms]">
            그리고
          </span>{" "}
          <span className="relative animate-[animeTextup_1500ms_infinite_500ms]">
            있어요~
          </span>
        </div>
        <div className="mt-20 mb-20 flex w-72 h-auto">
          <img
            src={cloud1}
            alt="cloud"
            className="relative z-10 top-[127px] right-[294px] animate-[updown_1s_infinite_ease-in-out_alternate]"
          />
          <img
            src={cloud2}
            alt="cloud"
            className="relative z-20  top-[47px] right-[596px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
          />
          <img
            src={sun}
            alt="sun"
            className="absolute z-0 w-[440px] h-[340px] right-[537px] bottom-[140px] animate-[tilting_1500ms_infinite_ease-in-out_alternate]"
          />
          <img
            src={cloud3}
            alt="cloud"
            className="relative right-[52px] bottom-[96px] animate-[updown_1s_infinite_ease-in-out_alternate]"
          />
          <img
            src={cloud1}
            alt="cloud"
            className="relative top-[63px] right-[407px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
          />
        </div>
        {/* <div className=" mt-[5vh]">PLEASE WAIT...</div> */}
        <div className=" mt-[10vh] flex">
          <div>PLEASE</div>
          <div className="pl-4">
            <span className=" opacity-0 animate-[fade_1s_forwards_100ms_alternate]">
              W
            </span>
            <span className=" opacity-0 animate-[fade_1s_forwards_200ms_alternate]">
              A
            </span>
            <span className=" opacity-0 animate-[fade_1s_forwards_300ms_alternate]">
              I
            </span>
            <span className=" opacity-0 animate-[fade_1s_forwards_400ms_alternate]">
              T
            </span>
            <span className=" opacity-0 animate-[fade_1s_infinite_500ms_alternate]">
              .
            </span>
            <span className=" opacity-0 animate-[fade_1s_infinite_700ms_alternate]">
              .
            </span>
            <span className=" opacity-0 animate-[fade_1s_infinite_900ms_alternate]">
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
