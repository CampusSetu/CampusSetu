import React from "react";
import Button from "./Button";

const Hero = () => {
  return (
    <header className="bg-bg relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 -translate-y-1/2 -z-10"
        width="640"
        height="320"
        viewBox="0 0 640 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 160 L160 96 L320 160 L480 96 L640 160 L640 0 L0 0 Z"
          fill="#2E6BFF"
          opacity="0.08"
        />
      </svg>
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight">
          Making campus hiring effortless
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Find relevant roles, apply with one click, and let placement cells
          manage drives with ease.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="primary">Try Beta</Button>
          <Button variant="ghost">Explore Jobs</Button>
        </div>
        <div className="mt-12 relative z-10">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-soft overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out">
            <img
              src="https://picsum.photos/seed/campus-setu/1200/600"
              alt="Campus Setu App Preview"
              className="w-full h-96 object-cover object-center"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
