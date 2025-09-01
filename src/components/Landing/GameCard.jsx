import Image from "next/image";

const decorePosition = {
  bottomLeft: "-left-4 -bottom-4",
  bottomRight: "left-4 -bottom-5",
  topRight: "-right-6 bottom-6",
};
function GameCard({ imageSrc, containerClass, decorPos, children }) {
  return (
    <div className={`relative  z-30 ${containerClass}`}>
      <Image
        fill
        quality={80}
        src={imageSrc}
        alt="image"
        className="rounded-3xl z-20 object-cover w-full h-full"
      />
      <div
        className={`absolute w-full h-full bg-[#FF7F4C] -z-10 rounded-4xl ${decorePosition[decorPos]}`}
      ></div>
      {children}
    </div>
  );
}

export default GameCard;
