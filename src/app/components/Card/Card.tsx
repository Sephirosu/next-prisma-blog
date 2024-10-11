import Image from "next/image";
import { Fa3 } from "react-icons/fa6";

const Card = () => {
  return (
    <div className="max-w-sm bg-white  shadow-md  ">
      <div className="relative">
        <Image
          src="/image.png"
          width={360}
          height={240}
          alt="Card"
          className=" h-60"
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500">Category</p>
        <h2 className="text-lg font-semibold capitalize my-2">
          the impact of technology on the workplace: how technology is changing
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 justify-between">
          <Fa3 />
          <p>Irfan Sahman</p>
          <p>22.07.2018</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
