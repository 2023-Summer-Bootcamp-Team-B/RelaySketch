import ResultsList from "./ResultsList";
import border1 from "../../assets/images/border1.png";

const ResultsSection = () => (
  <>
    <div className=" absolute z-10 sm:left-[38vw] left-2 sm:bottom-[9.4vh] md:left-[37vw] md:bottom-[9.4vh] lg:left-[36.8vw] lg:bottom-[9.4vh]">
      <img
        src={border1}
        alt="border1"
        className="sm:w-[45.7vw] sm:h-[76.5vh] w-[150vw] h-[50vh] "
      />
    </div>
    <div className=" ml-4 absolute left-[37vw] bottom-[14.5vh]  ">
      <ResultsList />
    </div>
  </>
);

export default ResultsSection;
