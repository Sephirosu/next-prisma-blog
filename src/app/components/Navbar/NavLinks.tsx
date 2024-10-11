import Link from "next/link";

const NavLinks = ({ isMobile }) => {
  const links = [
    { id: 1, link: "home", href: "/" },
    { id: 2, link: "blog", href: "/" },
    { id: 3, link: "single post", href: "/singlepost" },
    { id: 4, link: "pages", href: "/pages" },
    { id: 5, link: "contact", href: "/contact" },
  ];

  return (
    <div>
      <ul
        className={`${
          isMobile
            ? "flex flex-col items-center gap-4"
            : "flex capitalize gap-10"
        } text-[#3B3C4A]`}
      >
        {links.map(({ id, link, href }) => (
          <li key={id}>
            <Link href={href || "#"}>{link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavLinks;
