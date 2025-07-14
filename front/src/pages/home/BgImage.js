import "react-responsive-modal/styles.css";
import ApiCall from "../../config";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTelegramPlane, FaFacebookF, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";

function BgImage(props) {
  const { agentId } = useParams();
  const [open, setOpen] = useState(false);
  const [tel, setTel] = useState(""); // Phone number state
  const [success, setSuccess] = useState(false); // Submission success state
  const [message, setMessage] = useState(""); // Success/error message
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    let value = e.target.value;

    // Only allow digits after the initial +998
    if (value.length >= 14) return;

    if (value.startsWith("+998") && /^\+998\d{0,9}$/.test(value)) {
      if (value.length <= 13) setTel(value);
    } else if (value === "+998") {
      setTel(value);
    } else {
      setTel("+998");
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();

    // Validate the phone number format
    const phoneRegex = /^\+998\d{9}$/;
    if (!phoneRegex.test(tel)) {
      setMessage("Telefon raqami noto'g'ri formatda!");
      setOpen(true);
      return;
    }

    const obj = {
      phone: tel,
      agentId: agentId,
    };

    if (!tel || tel == "" || tel == null || tel == undefined) {
      navigate("/");
    } else {
      try {
        const response = await ApiCall(
          `/api/v1/abuturient`,
          "POST",
          obj,
          null,
          true
        );
        setSuccess(true);
        console.log("Response:", response === undefined);
        
        if (response.data === null || response === undefined) {
          navigate("/");
        } else if (response.data.status == 0) {
          navigate("/user-info", { state: { phone: tel } });
        } else if (response.data.status == 1) {
          navigate("/data-form", { state: { phone: tel } });
        } else if (response.data.status == 2) {
          navigate("/kabinet", { state: { phone: tel } });
        } else if (response.data.status == 3 || response.data.status == 4) {
          navigate("/result", { state: { phone: tel } })
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        setSuccess(false);
        setMessage("Xatolik yuz berdi.");
        setOpen(true);
      }
    }
  };
  return (
    <div className="bg-[#F6F6F6] h-screen">
      <div className="flex pt-12 md:pt-28 justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-16 text-[#213972]">
              XUSH KELIBSIZ!
            </h2>
            <h2 className=" text-lg sm:text-xl md:text-2xl font-bold mb-8 text-[#213972]">
              BUXORO XALQARO UNIVERSITETI QABUL PLATFORMASIGA
            </h2>

            {/* Login Form */}
            <div className="bg-white rounded-lg lg:max-w-[960px] max-w-[350px] mx-auto overflow-hidden pb-4">
              <div className=" pt-4">
                <h3 className="text-xl font-semibold text-[#213972]">
                  Assalomu aleykum!
                </h3>
              </div>
              <div className="px-4">
                <h3 className="text-base font-semibold text-[#737373]">
                  Sahifada keltirilgan bandlarni to'ldirish bo'yicha savollar tug'ilsa, quyidagi telefon raqamiga bog'laning!<br />
                  Sizga omad tilaymiz!
                </h3>
                <form onSubmit={handleSave} className="space-y-2 md:px-20">
                  <p className="text-sm text-[#050929] font-bold mb-1 text-left">
                    Telefon raqami
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 19 18"
                      >
                        <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="phone-input"
                      onChange={handleChange}
                      onClick={() => setTel("+998")}
                      value={tel}
                      aria-describedby="helper-text-explanation"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D9D9D9] focus:border-[#D9D9D9] outline-none"
                      placeholder="+998 __ ___-__-__"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#213972] text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      Davom etish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <h4 className="hidden md:block text-center text-lg md:text-xl text-[#213972] mt-14">Savollar bo'lsa bog'lanishingiz mumkin +998 55 309 99 99</h4>
          <h4 className="blcok md:hidden text-center text-lg md:text-xl text-[#213972] mt-14">Savollar bo'lsa bog'lanishingiz mumkin <br /> +998 55 309 99 99</h4>
          <div className="flex items-center justify-center gap-4 mt-3">
            <a href="https://t.me/bxu_uz" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 bg-[#213972] rounded-full flex items-center justify-center text-white text-sm md:text-base">
              <FaTelegramPlane />
            </a>
            <a href="https://www.facebook.com/BXU.UZ" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 bg-[#213972] rounded-full flex items-center justify-center text-white text-sm md:text-base">
              <FaFacebookF />
            </a>
            <a href="https://www.youtube.com/@bxu_uz" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 bg-[#213972] rounded-full flex items-center justify-center text-white text-sm md:text-base">
              <FaYoutube />
            </a>
            <a href="https://www.instagram.com/bxu.uz/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 bg-[#213972] rounded-full flex items-center justify-center text-white text-sm md:text-base">
              <FaInstagram />
            </a>
            <a href="https://bxu.uz/" target="_blank" rel="noopener noreferrer" className="w-6 h-6 md:w-8 md:h-8 bg-[#213972] rounded-full flex items-center justify-center text-white text-sm md:text-base">
              <FaGlobe />
            </a>
          </div>
          <div className="flex items-center justify-center mt-16">
            <div className="flex flex-col items-center">
              <div className="md:py-3 md:px-4 py-2 px-3 rounded-full flex items-center justify-center bg-blue-900 text-white font-semibold">
                1
              </div>
              <span className="text-sm text-blue-900 mt-2 textl-xl">Telefon raqam</span>
            </div>
            <div className="flex-1 h-px bg-[#EAEAEC] mb-4"></div>  {/* mb-4 -> mt-4 */}
            <div className="flex flex-col items-center">
              <div className="md:py-3 md:px-4 py-2 px-3 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 font-semibold">
                2
              </div>
              <span className="text-sm text-gray-400 mt-2 textl-xl">Ma'lumotnoma</span>
            </div>
            <div className="flex-1 h-px bg-[#EAEAEC] mb-4"></div>  {/* mb-4 -> mt-4 */}
            <div className="flex flex-col items-center">
              <div className="md:py-3 md:px-4 py-2 px-3 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 font-semibold">
                3
              </div>
              <span className="text-sm text-gray-400 mt-2 textl-xl">Yo'nalish tanlash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BgImage;
