import cloud1 from "../assets/images/cloud1.svg";
import cloud2 from "../assets/images/cloud2.svg";
import cloud3 from "../assets/images/cloud3.svg";
import sun from "../assets/images/sun.svg";

function LoadingPage() {
  return (
    <div className="w-screen h-screen font-bmjua bg-[#E7F5FF] flex flex-col items-center justify-center text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl">
      <div>
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
      <div className="flex">
        <img
          src={cloud1}
          alt="cloud"
          className="relative z-10 w-[430px] h-[340px] top-[150px] left-[200px] animate-[updown_1s_infinite_ease-in-out_alternate]"
        />
        <img
          src={cloud2}
          alt="cloud"
          className="relative z-20 w-[300px] h-[200px] top-[137px] right-[217px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
        />
        <img
          src={sun}
          alt="sun"
          className=" relative z-0 w-[550px] h-[450px] right-[180px] bottom-[30px] animate-[tilting_1500ms_infinite_ease-in-out_alternate]"
        />
        <img
          src={cloud3}
          alt="cloud"
          className="relative w-[320px] h-[270px] right-[70px] bottom-[80px] animate-[updown_1s_infinite_ease-in-out_alternate]"
        />
        <img
          src={cloud1}
          alt="cloud"
          className="relative w-[430px] h-[330px] right-[580px] top-[110px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
        />
      </div>
      {/* <div className=" mt-[5vh]">PLEASE WAIT...</div> */}
      <div className=" mt-[5vh] flex">
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
  );
}

export default LoadingPage;
