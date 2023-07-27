import PlayersSection from "../components/PlayerList/PlayersSection";
import ResultsSection from "../components/ResultsList/ResultsSection";

function ResultsPage() {
  return (
    <div className=" h-screen w-screen flex justify-center items-center font-hs bg-[#E7F5FF] ">
      <PlayersSection />
      <ResultsSection />
    </div>
  );
}

export default ResultsPage;
