import 구름1 from "../assets/images/구름1.svg";
import 구름2 from "../assets/images/구름2.svg";
import 구름3 from "../assets/images/구름3.svg";
// import 햇님 from "../assets/images/햇님.svg";

type BackgroundProps = {
  children: React.ReactNode;
  title: string;
  input: string;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
};

function Background({
  children,
  title,
  input,
  handleInput,
  handleSubmit,
}: BackgroundProps) {
  return (
    <div className="w-full min-h-screen h-full pt-10 border m-auto bg-[#E7F5FF] font-bmjua mx-auto mr-50 relative ">
      <div className=" z-50">
        <div className="flex pr-20">
          <span className="text-[82px] ml-20 my-30 "> 1/4</span>{" "}
          <span className="text-[56px] mx-auto pr-32">{title}</span>
        </div>

        <div className="flex w-full">
          <div className=" h-[82px] ml-20 bg-white items-center">
            <span className="text-[56px] p-[20px] align-middle">n/4</span>
          </div>
          <div className="relative flex justify-center mb-7 mx-auto pr-48">
            <img
              src={구름2}
              alt="cloud2"
              className="relative left-36 z-20 top-10"
            />
            <img src={구름1} alt="cloud1 " className="relative top-24" />
            {children}
            <img src={구름1} alt="cloud1" className=" z-5 bottom-8 relative" />
            <img
              src={구름3}
              alt="cloud2"
              className=" z-10 relative bottom-44 right-44"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-[30px] ">
          <input
            className="p-[30px] w-[780px] h-[100px] text-[42px]"
            type="text"
            value={input}
            onChange={handleInput}
          />{" "}
          <button
            className="text-[48px] bg-white px-10"
            type="submit"
            onClick={handleSubmit}
          >
            편집
          </button>
        </div>
      </div>
    </div>
  );
}

export default Background;
