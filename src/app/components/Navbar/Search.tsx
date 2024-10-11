import Image from "next/image";

const Search = () => {
  return (
    <div className="flex items-center container justify-between  bg-[#f4f4f5] rounded-md text-base xs:w-[210px] lg:w-[166px] h-9  ">
      <input
        placeholder="Search"
        className="text-black placeholder:text-[#A1A1AA] placeholder-shown:text-[#A1A1AA] ml-4 w-32 outline-none bg-[#f4f4f5]"
      ></input>
      <div className="mr-2 cursor-pointer">
        <Image src="search-outline.svg" alt="search" width={16} height={16} />
      </div>
    </div>
  );
};

export default Search;
