import ResultsList from "./ResultsList";
import border from "../../assets/images/border.png";

const ResultsSection = () => (
  <>
    <div className=" absolute z-10 left-[38vw] bottom-[9.4vh] md:left-[37vw] md:bottom-[9.4vh] lg:left-[36.8vw] lg:bottom-[9.4vh]">
      <img src={border} alt="" className="w-[45.7vw] h-[76.5vh]" />
    </div>
    <div className=" ml-4 absolute left-[37vw] bottom-[14.5vh]">
      <ResultsList />
    </div>
  </>
);

export default ResultsSection;
