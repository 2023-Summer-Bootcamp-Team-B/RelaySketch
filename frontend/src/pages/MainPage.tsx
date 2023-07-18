/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";

import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import sketch from "../assets/images/sketch_border.svg";
import sun from "../assets/images/sun.svg";

function MainPage() {
  const [sketchWidth, setSketchWidth] = useState(0);
  const [sketchHeight, setSketchHeight] = useState(0);
  const sketchRef = useRef<HTMLImageElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const childAspectRatio = 1;
  const childDistanceFromC = 30; // Npx로 설정

  useEffect(() => {
    if (sketchRef.current && childRef.current) {
      setSketchWidth(sketchRef.current.offsetWidth);
      setSketchHeight(sketchRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      if (sketchRef.current && childRef.current) {
        setSketchWidth(sketchRef.current.offsetWidth);
        setSketchHeight(sketchRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (childRef.current) {
      const childHeight = (sketchHeight / 2) * childAspectRatio * 1.66;
      const childWidth = (sketchWidth / 2) * childAspectRatio * 1.7;

      childRef.current.style.height = `${childHeight}px`;
      childRef.current.style.width = `${childWidth}px`;
      childRef.current.style.transform = `translateY(${childDistanceFromC}px)`;
    }
  }, [sketchWidth]);

  return (
    <div className="relative h-screen w-screen bg-[#E7F5FF]">
      <div className="relative">
        <div className="absolute  w-[500px] left-[708px] top-[380px] animate-slider_left_invisible ">
          <img src={cloud2} alt="cloud 1" className="w-full h-full " />
        </div>

        <div className="absolute  w-[500px] top-20- animate-slider_right">
          <img src={cloud1} alt="cloud 1" className="w-full h-full" />
        </div>

        <div className="absolute w-[500px] left-[708px] translate-y-1/2 translate-x-1/2 top-40 animate-slider_left">
          <img src={cloud1} alt="cloud 1" className="w-full h-full" />
        </div>
      </div>

      <div className="relative flex items-center justify-center h-screen bottom-[20px]">
        <img
          src={sketch}
          className="absolute z-10 w-[55%] "
          ref={sketchRef}
          alt="backgroud"
        />
        <div
          className="absolute mb-1 bg-white"
          style={{ width: sketchWidth, height: sketchHeight }}
          ref={childRef}
        >
          <div>
            <img
              src={sun}
              className="absolute z-20 w-1/3 h-auto pr-1 mt-3 animate-wiggle"
              style={{ top: "0", left: "0" }}
              alt="backgroud sun"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pt-5 z-2 ">
            <p className="text-center transform -translate-y-[70px] font-crayon text-[110px]">
              &nbsp;RELAY
            </p>
            <p className="absolute text-center transform translate-y-[60px] font-crayon text-[110px]">
              SKETCH
            </p>

            <div className="absolute inset-0 flex items-center justify-center duration-75 transform translate-y-[180px] scale-1 z-2 animate-pulse">
              <p className="text-[40px] font-crayon mb-3">
                PRESS ANY KEY TO PLAY
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
