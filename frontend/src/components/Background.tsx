import 구름1 from "../assets/images/구름1.svg";
import 구름2 from "../assets/images/구름2.svg";
import 구름3 from "../assets/images/구름3.svg";
import 버튼테두리 from "../assets/images/버튼테두리.svg";
import 인원수테두리 from "../assets/images/인원수테두리.svg";
import 입력창테두리 from "../assets/images/입력창테두리.svg";
import 체크 from "../assets/images/체크.svg";

type BackgroundProps = {
  children: React.ReactNode;
  title: string;
  input: string;
  round: number;
  completeNum: number;
  total: number;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
};

function Background({
  children,
  title,
  input,
  round,
  completeNum,
  total,
  handleInput,
  handleSubmit,
}: BackgroundProps) {
  return (
    <div className="w-full min-h-screen h-full border m-auto bg-[#E7F5FF] font-hs mx-auto relative flex flex-col items-center overflow-hidden">
      <div
        className=" z-50 w-[1000px] fixed bottom-1/2 right-1/2
      h-660 translate-x-1/2 translate-y-1/2
      transform"
      >
        <div className="flex pt-10">
          <span className="text-[82px] ">
            {round}/{total}
          </span>{" "}
          <span className="text-[56px] mx-auto mt-3 pl-12">{title}</span>
          <span className="text-[82px] z-40">29.9 </span>
        </div>
        <div className="flex relative">
          <div className="relative w-[180px] h-20">
            <div className="flex items-center bg-white w-[178px] h-[76px] pl-3">
              <img src={체크} alt="check" className=" w-[54px] bottom-7 z-40" />
              <span className="text-[50px] flex px-2 z-40">
                {completeNum}/{total}
              </span>
            </div>
            <img
              src={인원수테두리}
              alt="playerline"
              className="absolute bottom-[2px]"
            />
          </div>
          {children}
          <div className="absolute flex w-72 h-auto">
            <img
              src={구름2}
              alt="cloud2"
              className="relative left-12 z-20 top-36"
            />
            <img
              src={구름1}
              alt="cloud1 "
              className="relative top-56 right-40"
            />
            <img
              src={구름1}
              alt="cloud1"
              className=" z-5 top-40 left-40 relative"
            />
            <img src={구름3} alt="cloud2" className=" z-10 relative left-4" />
          </div>
        </div>

        <div className="relative w-auto flex mt-2 mb-6 justify-center mx-auto ml-16">
          <div className="w-[600px] h-[140px]">
            <img
              src={입력창테두리}
              alt="input"
              className=" absolute w-[590px] h-[335px] bottom-[-75px] left-[75px] z-20"
            />
            <input
              className=" w-[570px] h-[100px] text-[42px] absolute pl-6 ml-3 z-30 outline-none"
              type="text"
              value={input}
              onChange={handleInput}
            />
          </div>

          <div className=" relative w-[188px]">
            <img
              src={버튼테두리}
              alt="buttonline"
              className=" absolute bottom-[27px] left-[-5px] w-auto h-[127px] z-20"
            />
            <button
              className="text-[42px] px-6 z-30 py-[12px] h-[100px] absolute bg-white whitespace-nowrap"
              type="submit"
              onClick={handleSubmit}
            >
              편집
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Background;
