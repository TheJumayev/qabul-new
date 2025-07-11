import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import ApiCall, { baseUrl } from "../../config";
import Select from "react-select";
import passfront from "./passfront.png"
import id from "./id.png"
import Kabinet from "./Kabinet"
import { FaTelegramPlane, FaFacebookF, FaYoutube, FaInstagram, FaGlobe } from "react-icons/fa";


function Directions() {
  const [activeField, setActiveField] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "";
  const [formData, setFormData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [abuturient, setAbuturient] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    phone: phone || "",
    additionalPhone: "",
    language: true,
    educationFormId: "",
    regionId: "",
    districtId: "",
    passportNumber: "",
    passportPin: "",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchRegions();
    getPhoneData();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await ApiCall("/api/v1/region", "GET", null, null);
      setRegions(
        response.data.map((region) => ({
          value: region.id,
          label: region.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const fetchRegionDistricts = async (regionId) => {
    setLoadingDistricts(true);
    try {
      const response = await ApiCall(
        `/api/v1/district/${regionId}`,
        "GET",
        null,
        null
      );
      setDistricts(
        response.data.map((district) => ({
          value: district.id,
          label: district.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const getPhoneData = async () => {
    try {
      const response = await ApiCall(
        `/api/v1/history-of-abuturient/${phone}`,
        "POST",
        null,
        null,
        true
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    try {
      const response = await ApiCall(
        `/api/v1/abuturient/${phone}`,
        "GET",
        null,
        null,
        true
      );

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !abuturient.firstName ||
      !abuturient.lastName ||
      !abuturient.phone ||
      !abuturient.educationFormId ||
      !abuturient.regionId ||
      !abuturient.districtId ||
      !abuturient.passportNumber ||
      abuturient.passportNumber.length !== 9 ||
      !abuturient.passportPin ||
      abuturient.passportPin.length !== 14
    ) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    try {
      const response = await ApiCall(
        `/api/v1/abuturient`,
        "PUT",
        abuturient,
        null,
        true
      );
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Xatolik yuz berdi. Ma'lumotni saqlashning iloji bo'lmadi.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "passportPin") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length <= 14) {
        setAbuturient((prev) => ({ ...prev, [name]: numericValue }));
      }
      return;
    }
    if (name === "passportNumber") {
      const formattedValue = value.toUpperCase(); // Convert to uppercase
      const letters = formattedValue.slice(0, 2).replace(/[^A-Z]/g, ""); // First 2 capital letters
      const numbers = formattedValue.slice(2).replace(/\D/g, ""); // Remaining numeric characters
      const passportNumber = `${letters}${numbers.slice(0, 7)}`; // Combine letters and up to 7 numbers
      setAbuturient((prev) => ({ ...prev, [name]: passportNumber }));
      return;
    }
    setAbuturient({ ...abuturient, [name]: value });
  };



  const handleSelectChange = (selectedOption, { name }) => {
    setAbuturient({ ...abuturient, [name]: selectedOption.value });
    if (name === "regionId") {
      fetchRegionDistricts(selectedOption.value);
      setAbuturient((prev) => ({
        ...prev,
        districtId: "",
      }));
      setDistricts([]);
    }
  };

  const handleNavigate = () => {
    localStorage.clear();
    navigate("/test", { state: { phone } });
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/abuturient/contract/${phone}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("The response is not a valid PDF file.");
      }

      const blob = await response.blob();
      if (!blob.size) {
        throw new Error("The PDF file is empty.");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Contract_${phone}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
      borderRadius: "0.375rem",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      boxShadow: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3b82f6" : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:hover": {
        backgroundColor: "#e5e7eb",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      position: "absolute",
      marginTop: "0.25rem",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
  return (
    <div>
      <Header />
      <section className="bg-[#F6F6F6] h-screen pt-24">
        <div className="container mx-auto px-4 ">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12 text-center text-white my-10 mt-8">

              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <h2 className="text-xl md:text-lg font-bold mb-3 text-center text-[#213972]">
                  Ro'yxatdan o'tish
                </h2>
                <p className="text-[#737373] text-base">Ro’yhatdan o’tish uchun ushub ma’lumotni to’ldiring!</p>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Familiya
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={abuturient.lastName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ism
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={abuturient.firstName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>



                    {/* Father's Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sharifi
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={abuturient.fatherName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone */}
                    {(formData?.agent?.id == "cf8aeeef-c3ab-439e-8b77-8ef05f13e425" || formData?.agent?.id == "d48b9ebf-390c-4cad-a374-391618bae5cd" || formData?.agent?.id == "74053079-b947-4fca-a825-92c0deab79bc") ?

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Onasi haqida ma'lumot (F.I.O)
                        </label>
                        <input
                          type="text"
                          name="motherName"
                          required
                          value={abuturient.motherName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      :
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon raqami { }
                        </label>
                        <input
                          type="text"
                          name="phone"
                          disabled={true}
                          value={abuturient.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                          required
                        />
                      </div>

                    }
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport seriya raqami</label>
                      <input
                        type="text"
                        name="passportNumber"
                        value={abuturient.passportNumber}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField("passportPin")}
                        onBlur={() => setActiveField("")}
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                      {(activeField === "passportNumber" || activeField === "passportPin") && (
                        <div className="mt-6 animate-fadeIn">
                          <div className="mx-auto max-w-3xl bg-[#004CFF08] rounded-xl p-4 pb-2 shadow-sm border border-[#256DF6]">
                            <h4 className="text-center text-sm font-semibold text-blue-800 mb-3">
                              Namuna: Fuqarolik hujjatlari
                            </h4>
                            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                              {/* Passport Front */}
                              <div className="text-center">
                                <div className="inline-block rounded-lg shadow-md border border-[#213972]">
                                  <img
                                    src={passfront}
                                    alt="Passport old tomoni"
                                    className="w-full max-w-[180px] h-auto object-contain"
                                  />
                                </div>
                                <p className="mt-1 text-[10px] text-[#213972] font-medium">
                                  Fuqarolik pasport (old tomoni)
                                </p>
                              </div>

                              {/* ID Card */}
                              <div className="text-center">
                                <div className="inline-block rounded-lg shadow-md border border-[#213972]">
                                  <img
                                    src={id}
                                    alt="ID karta"
                                    className="w-full max-w-[180px] h-auto object-contain"
                                  />
                                </div>
                                <p className="mt-1 text-[10px] text-[#213972] font-medium">
                                  ID karta (orqa tomoni)
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-center text-black">
                              Passport yoki ID karta ma'lumotlarini yuqoridagi namunalarga mos ravishda kiriting
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">JSHIR</label>
                      <input
                        type="text"
                        name="passportPin"
                        value={abuturient.passportPin}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField("passportPin")}
                        onBlur={() => setActiveField("")}
                        className="border border-gray-300 rounded-md p-1 w-full"
                      />
                      {(activeField === "passportNumber" || activeField === "passportPin") && (
                        <div className="mt-6 animate-fadeIn">
                          <div className="mx-auto max-w-3xl bg-[#004CFF08] rounded-xl p-4 pb-2 shadow-sm border border-[#256DF6]">
                            <h4 className="text-center text-sm font-semibold text-blue-800 mb-3">
                              Namuna: Fuqarolik hujjatlari
                            </h4>
                            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                              {/* Passport Front */}
                              <div className="text-center">
                                <div className="inline-block rounded-lg shadow-md border border-[#213972]">
                                  <img
                                    src={passfront}
                                    alt="Passport old tomoni"
                                    className="w-full max-w-[180px] h-auto object-contain"
                                  />
                                </div>
                                <p className="mt-1 text-[10px] text-[#213972] font-medium">
                                  Fuqarolik pasport (old tomoni)
                                </p>
                              </div>

                              {/* ID Card */}
                              <div className="text-center">
                                <div className="inline-block rounded-lg shadow-md border border-[#213972]">
                                  <img
                                    src={id}
                                    alt="ID karta"
                                    className="w-full max-w-[180px] h-auto object-contain"
                                  />
                                </div>
                                <p className="mt-1 text-[10px] text-[#213972] font-medium">
                                  ID karta (orqa tomoni)
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-center text-black">
                              Passport yoki ID karta ma'lumotlarini yuqoridagi namunalarga mos ravishda kiriting
                            </p>
                          </div>
                        </div>
                      )}
                    </div>



                    {/* Region */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Viloyat
                      </label>
                      <Select
                        name="regionId"
                        value={regions.find(
                          (option) =>
                            option.value === abuturient.regionId
                        )}
                        onChange={handleSelectChange}
                        options={regions}
                        placeholder="Viloyatni tanlang"
                        isSearchable
                        styles={customStyles}
                        required
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuman/Shahar
                      </label>
                      <Select
                        name="districtId"
                        value={districts.find(
                          (option) =>
                            option.value === abuturient.districtId
                        )}
                        onChange={handleSelectChange}
                        options={districts}
                        placeholder={
                          loadingDistricts
                            ? "Yuklanmoqda..."
                            : "Tuman/Shaharni tanlang"
                        }
                        isDisabled={
                          !abuturient.regionId || loadingDistricts
                        }
                        isSearchable
                        styles={customStyles}
                        required
                      />
                    </div>
                  </div>
                  {/* Save Button */}
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
      </section>
    </div>
  );
}

export default Directions;
