import AI이미지 from "../assets/images/AI이미지.svg";
import 스케치북테두리 from "../assets/images/스케치북테두리.svg";
import Background from "../components/Background";

function GuessImagePage() {
  return (
    <div>
      <div>
        <Background title="이미지를 맞혀보세요!">
          <img
            src={스케치북테두리}
            alt="sketchline"
            className=" w-[500px] h-[400px] z-40 relative mx-auto ml-[80px] pb-10"
          />
          <img
            src={AI이미지}
            alt="aiimage"
            className="bg-white w-[450px] h-[300px] z-10 absolute mx-auto right-[275px] top-[50px]"
          />
        </Background>
      </div>
    </div>
  );
}

export default GuessImagePage;
