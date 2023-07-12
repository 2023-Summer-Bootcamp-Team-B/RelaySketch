import border from "../assets/images/border.png";
import Header from "../components/Header/Header";
import PlayerList from "../components/PlayerList/PlayerList";
import ResultsList from "../components/ResultsList/ResultsList";

function ResultsPage() {
  const playerArray = [
    { name: "플레이어1" },
    { name: "플레이어2" },
    { name: "플레이어3" },
    { name: "플레이어4" },
  ];

  const resultsSet = {
    round: 2,
    results: [
      { name: "플레이어2", input: "Lorem Ipsum", src: "#", isLast: false },
      { name: "플레이어1", input: "dolor sit", src: "#", isLast: false },
      { name: "플레이어3", input: "Lorem Ipsum", src: "#", isLast: false },
      { name: "플레이어4", input: "consectetur", src: "", isLast: true },
    ],
  };

  return (
    <div className=" h-screen w-screen flex justify-center items-center font-bmjua bg-[#E7F5FF] ">
      {/* 플레이어 목록 테두리 */}
      <div className=" absolute z-10 left-[19vw] bottom-[9vh]">
        <img src={border} alt="" className="w-[17.5vw] h-[77vh]" />
      </div>
      {/* 플레이어 컨테이너 */}
      <div className=" mr-4 text-center absolute left-[19.8vw] bottom-[14vh] ">
        {/* 제목 */}
        <Header
          className=" text-3xl md:text-4xl xl:text-5xl "
          title="플레이어"
        />
        {/* 목록 */}
        <PlayerList players={playerArray} />
      </div>
      {/* 스케치북 모음 테두리 */}
      <div className=" absolute z-10 left-[36vw] bottom-[9vh]">
        <img src={border} alt="" className="w-[46vw] h-[77vh]" />
      </div>
      {/* 스케치북 컨테이너 */}
      <div className=" ml-4 absolute left-[37vw] bottom-[14.5vh]">
        {/* 제목 */}
        <Header
          className=" text-3xl md:text-4xl xl:text-5xl text-center mb-4 "
          title="플레이어2 님의 스케치북"
        />
        {/* 앨범 */}
        <ResultsList round={resultsSet.round} results={resultsSet.results} />
      </div>
    </div>
  );
}

export default ResultsPage;
