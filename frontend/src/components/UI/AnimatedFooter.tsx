const AnimatedFooter = () => (
  // <div className=" mt-[5vh]">PLEASE WAIT...</div>
  <footer className=" mt-[10vh] flex">
    <div>PLEASE WAIT</div>
    <div className="pl-2">
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
