import cloud1 from "../../assets/images/구름1.svg";
import cloud2 from "../../assets/images/구름2.svg";
import cloud3 from "../../assets/images/구름3.svg";
import sun from "../../assets/images/햇님.svg";

const AnimatedBackground = () => (
  <section className="mt-20 mb-20 flex w-72 h-[200px] max-[640px]:scale-50 sm:scale-50 md:scale-75 lg:scale-75 xl:scale-100">
    <img
      src={cloud1}
      alt="cloud"
      className="relative z-10 top-[127px] right-[294px] animate-[updown_1s_infinite_ease-in-out_alternate]"
    />
    <img
      src={cloud2}
      alt="cloud"
      className="relative z-20  top-[47px] right-[596px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
    />
    <img
      src={sun}
      alt="sun"
      className="absolute z-0  max-w-[400px] h-[345px] bottom-[-90px] right-[-55px] animate-[tilting_1500ms_infinite_ease-in-out_alternate]"
    />
    <img
      src={cloud3}
      alt="cloud"
      className="relative right-[52px] bottom-[96px] animate-[updown_1s_infinite_ease-in-out_alternate]"
    />
    <img
      src={cloud1}
      alt="cloud"
      className="relative top-[63px] right-[407px] animate-[updown_1500ms_infinite_ease-in-out_alternate]"
    />
  </section>
);

export default AnimatedBackground;
