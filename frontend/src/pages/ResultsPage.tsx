import PlayersSection from "../components/PlayerList/PlayersSection";
import ResultsSection from "../components/ResultsList/ResultsSection";

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
      <PlayersSection players={playerArray} />
      <ResultsSection resultsSet={resultsSet} />
    </div>
  );
}

export default ResultsPage;
