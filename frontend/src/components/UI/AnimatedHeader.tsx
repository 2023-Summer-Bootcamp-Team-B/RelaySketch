import Header from "../Header/Header";

const AnimatedHeader = () => (
  <Header className="mb-10">
    <>
      <span className="relative animate-[animeTextup_1500ms_infinite_100ms]">
        태양이가
      </span>{" "}
      <span className="relative animate-[animeTextup_1500ms_infinite_200ms]">
        열심히
      </span>{" "}
      <span className="relative animate-[animeTextup_1500ms_infinite_300ms]">
        그림을
      </span>{" "}
      <span className="relative animate-[animeTextup_1500ms_infinite_400ms]">
        그리고
      </span>{" "}
      <span className="relative animate-[animeTextup_1500ms_infinite_500ms]">
        있어요~
      </span>
    </>
  </Header>
);

export default AnimatedHeader;
