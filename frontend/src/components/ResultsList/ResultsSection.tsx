import ResultsList from "./ResultsList";
import border from "../../assets/images/border.png";
import Header from "../Header/Header";

type LabelImgSet = {
  name: string;
  input: string;
  src: string | undefined;
  isLast: boolean;
};

type ResultsSetObj = {
  round: number;
  results: LabelImgSet[];
};

type ResultsSetPropsType = {
  resultsSet: ResultsSetObj;
};

const ResultsSection = ({ resultsSet }: ResultsSetPropsType) => (
  <>
    <div className=" absolute z-10 left-[38vw] bottom-[9.4vh] md:left-[37vw] md:bottom-[9.4vh] lg:left-[36.8vw] lg:bottom-[9.4vh]">
      <img src={border} alt="" className="w-[45.7vw] h-[76.5vh]" />
    </div>
    <div className=" ml-4 absolute left-[37vw] bottom-[14.5vh]">
      {/* 제목 */}
      <Header className=" text-3xl md:text-4xl xl:text-5xl text-center mb-8 ">
        플레이어2 님의 스케치북
      </Header>
      {/* 앨범 */}
      <ResultsList round={resultsSet.round} results={resultsSet.results} />
    </div>
  </>
);

export default ResultsSection;
