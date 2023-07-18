/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";

import cloud1 from "../assets/images/구름1.svg";
import cloud2 from "../assets/images/구름2.svg";
import cloud3 from "../assets/images/구름3.svg";
import invite from "../assets/images/invite_link.svg";
import play from "../assets/images/play.svg";
import sketch from "../assets/images/sketch_book_white.svg";
import small_border from "../assets/images/small_box_border.svg";


function PlayerRoomPage() {
  return (
    <div className="h-screen w-screen bg-[#E7F5FF] flex items-center justify-center">
      <img src={sketch} alt="Sketch" className="relative z-10 bottom-5 w-[55%]" />
      <div className="absolute grid grid-cols-2 grid-rows-3 mt-16 gap-x-[300px] gap-y-[140px] mb-8 ">
        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[70px] mt-[33px] font-crayon text-[40px]">
              PLAYER1
            </p>
            <div className="absolute bg-[#E7F5FF] z-39 h-[100%] w-[91%] top-1 left-2.5" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[70px] mt-[33px] font-crayon text-[40px]">
              PLAYER1
            </p>
            <div className="absolute bg-[#E7F5FF] z-39 h-[100%] w-[91%] top-1 left-2.5" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[70px] mt-[33px] font-crayon text-[40px]">
              PLAYER1
            </p>
            <div className="absolute bg-[#E7F5FF] z-39 h-[100%] w-[91%] top-1 left-2.5" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[70px] mt-[33px] font-crayon text-[40px]">
              PLAYER1
            </p>
            <div className="absolute bg-[#E7F5FF] z-39 h-[100%] w-[91%] top-1 left-2.5" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[70px] mt-[33px] font-crayon text-[40px]">
              PLAYER1
            </p>
            <div className="absolute bg-[#E7F5FF] z-39 h-[100%] w-[91%] top-1 left-2.5" />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute  z-20 w-[300px] h-[100px]">
            <img
              src={small_border}
              alt=""
              className="absolute z-30 w-full h-auto"
            />
            <p className="absolute z-30  ml-[90px] mt-[33px] font-crayon text-[40px]">
              EMPTY
            </p>
            <div className="absolute bg-gray-400 z-39 h-[100%] w-[91%] top-2 left-3" />
          </div>
        </div>
      </div>

      <div className="absolute flex items-center justify-center left-[500px] mt-[650px] ml-10">
        <div className="absolute  z-20 w-[190px] h-[65px]">
          <img
            src={small_border}
            alt=""
            className="absolute z-30 w-full h-auto"
          />
          <img src={invite} alt="" className="absolute z-30 mt-5 ml-5" />

          <p className="absolute z-30  ml-[70px] mt-[10px] font-crayon text-[40px]">
            Link
          </p>
          <div className="absolute bg-white z-39 h-[100%] w-[91%] top-1 left-2.5" />
        </div>
      </div>

      <div className="absolute flex items-center justify-center right-[500px] mt-[650px] mr-10">
        <div className="absolute  z-20 w-[190px] h-[65px]">
          <img
            src={small_border}
            alt=""
            className="absolute z-30 w-full h-auto"
          />
          <img src={play} alt="" className="absolute z-30 mt-5 ml-5" />

          <p className="absolute z-30  ml-[70px] mt-[10px] font-crayon text-[40px]">
            Start
          </p>
          <div className="absolute bg-white z-39 h-[100%] w-[91%] top-1 left-2.5" />
        </div>
      </div>

      <div>
        <img
          src={cloud1}
          alt=""
          className="absolute z-0 bottom-96 w-96 right-[200px]"
        />
      </div>

      <div>
        <img
          src={cloud3}
          alt=""
          className="absolute z-0 top-10 right-[200px]"
        />
      </div>

      <div>
        <img src={cloud1} alt="" className="absolute z-0 left-[200px] bottom" />
      </div>

      <div>
        <img src={cloud2} alt="" className="absolute z-0 left-[200px]" />
      </div>
    </div>
  );
}

export default PlayerRoomPage;
