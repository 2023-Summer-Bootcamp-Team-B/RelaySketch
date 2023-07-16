const AnimatedFooter = () => (
  // <div className=" mt-[5vh]">PLEASE WAIT...</div>
  <footer className=" mt-[10vh] flex">
    <div>PLEASE</div>
    <div className="pl-4">
      <span className=" opacity-0 animate-[fade_1s_forwards_100ms_alternate]">
        W
      </span>
      <span className=" opacity-0 animate-[fade_1s_forwards_200ms_alternate]">
        A
      </span>
      <span className=" opacity-0 animate-[fade_1s_forwards_300ms_alternate]">
        I
      </span>
      <span className=" opacity-0 animate-[fade_1s_forwards_400ms_alternate]">
        T
      </span>
      <span className=" opacity-0 animate-[fade_1s_infinite_500ms_alternate]">
        .
      </span>
      <span className=" opacity-0 animate-[fade_1s_infinite_700ms_alternate]">
        .
      </span>
      <span className=" opacity-0 animate-[fade_1s_infinite_900ms_alternate]">
        .
      </span>
    </div>
  </footer>
);

export default AnimatedFooter;
