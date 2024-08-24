import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" bg-black text-white ">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo1.jpeg"
            alt="logo"
            width={38}
            height={38}
          />
        </Link>

        <p>Copyright &copy; 2024 EventSnap. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
