import { Link } from "react-router-dom";
import logo from "../../images/logoMain.png";

function Header() {
  return (
    <header className="bg-[#213972] fixed w-full z-50 shadow-2xl">
      <div className="flex items-center justify-between py-2 px-20">
        <div className="flex items-center justify-center flex-shrink-0 z-10">
          <Link to="/" className="flex items-center no-underline">
            <img
              className="h-14 md:h-20 filter contrast-more"
              alt="Buxoro Xalqaro Universiteti logo"
              src={logo}
            />
            <div className="ml-4">
              <h5 className="mb-0 text-white text-xl font-semibold md:text-2xl leading-tight">
                BUXORO XALQARO <br /> UNIVERSITETI
              </h5>
            </div>
          </Link>
        </div>

        <div>
          <h4 className="text-white">
            +998 55 309 99 99
          </h4>
        </div>
      </div>
    </header>
  );
}

export default Header;
