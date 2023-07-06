import { useState } from "react";

// import 구름1 from "../assets/images/구름1.svg";
// import 구름2 from "../assets/images/구름2.svg";
// import 구름3 from "../assets/images/구름3.svg";
import 햇님 from "../assets/images/햇님.svg";
import Background from "../components/Background";

// function GuessImagePage() {
//   return (
//     <div className="w-full min-h-screen h-full pt-10 border m-auto bg-[#E7F5FF] font-bmjua mx-auto mr-50 relative ">
//       <div className=" z-50">
//         <div className="flex pr-20">
//           <span className="text-[82px] ml-20 my-30 ">1/4</span>{" "}
//           <span className="text-[56px] mx-auto pr-32">주제를 입력하세요!</span>
//         </div>

//         <div className="flex w-full">
//           <div className=" h-[82px] ml-20 bg-white items-center">
//             <span className="text-[56px] p-[20px] align-middle">n/4</span>
//           </div>
//           <div className="relative flex justify-center mb-7 mx-auto pr-48">
//             <img
//               src={구름2}
//               alt="cloud2"
//               className="relative left-52 z-20 top-10"
//             />
//             <img src={구름1} alt="cloud1 " className="relative top-28" />
//             <img src={햇님} alt="sun" className="w-96 object-contain" />
//             <img src={구름1} alt="cloud1" className=" z-5 bottom-8 relative" />
//             <img
//               src={구름3}
//               alt="cloud2"
//               className=" z-10 relative bottom-44 right-44"
//             />
//           </div>
//         </div>

//         <div className="flex justify-center space-x-[30px] ">
//           <input
//             className="p-[30px] w-[780px] h-[100px] text-[42px]"
//             type="text"
//           ></input>{" "}
//           <button className="text-[48px] bg-white px-10">편집</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GuessImagePage;

function InputSubjectPage() {
  const [input, setInput] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };
  const handleSubmit = () => {
    console.log("InputSubjectPage에서 편집버튼 누름", input);
  };
  return (
    <Background
      title="주제를 입력하세요!"
      input={input}
      handleInput={handleInput}
      handleSubmit={handleSubmit}
    >
      <img src={햇님} alt="sun" className="w-96 object-contain" />
    </Background>
  );
}

export default InputSubjectPage;
