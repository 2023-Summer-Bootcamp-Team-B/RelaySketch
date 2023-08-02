import { observer } from "mobx-react";
import { useEffect } from "react";

import PlayersSection from "../components/PlayerList/PlayersSection";
import ResultsSection from "../components/ResultsList/ResultsSection";
import WebsocketStore from "../stores/WebsocketStore";

const ResultsPage = observer(() => {
  const { error } = WebsocketStore;

  useEffect(() => {
    if (error) {
      alert(error);
      window.location.href = "/";
    }
  }, [error]);

  return (
    <div className=" h-screen w-screen flex justify-center items-center font-hs bg-[#E7F5FF] ">
      <PlayersSection />
      <ResultsSection />
    </div>
  );
});

export default ResultsPage;
