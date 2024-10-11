import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="cursor-pointer  xsm:flex hidden">
      <Link href="/">
        <Image
          src="logo/logo.svg"
          alt="logo"
          className="w-16 xsm:w-40"
          width={156}
          height={36}
        />
      </Link>
    </div>
  );
};

export default Logo;
