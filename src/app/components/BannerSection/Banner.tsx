import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex justify-center my-8 mx-3 ">
      <Image
        src="/image.png"
        alt="Welcome to our website"
        width={1252}
        height={450}
      />
    </div>
  );
};

export default Banner;
