// app/components/Carousel.tsx

import { useState, useEffect } from "react";

const images = ["/login/img1.jpg", "/login/img2.jpg", "/login/img3.jpg"];

const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex md:w-[70%] items-center justify-center relative overflow-hidden">
      <img
        src={images[current]}
        alt="Carrossel"
        className="object-cover w-full h-full transition-all duration-700"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default Carousel;
