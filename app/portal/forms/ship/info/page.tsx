"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ShipInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    address1: "",
    address2: "",
    country: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log("Shipping form submitted:", formData, "projectId:", projectId);
    router.push("/portal");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen relative font-sans pb-12"
      style={{
        background: "#C0DEFE",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/background/bunny-tile.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "213px 210px",
        }}
      />

      {/* Ship Title */}
      <div className="flex justify-center pt-8 relative z-10">
        <h1 className="relative font-bold text-[64px] md:text-[96px] text-center">
          {/* White stroke layer behind */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              fontFamily: "'MADE Tommy Soft Outline', sans-serif",
              color: "#FFFFFF",
              WebkitTextStroke: "10px",
              filter:
                "drop-shadow(0px 4px 0px #C6C7E4) drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))",
            }}
          >
            Ship
          </span>
          {/* Text on top */}
          <span
            className="relative"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#89A8EF",
            }}
          >
            Ship
          </span>
        </h1>
      </div>

      {/* Main Card */}
      <div className="relative z-10 mx-auto mt-8 max-w-[1200px] px-4">
        <div
          className="relative rounded-[24px] p-6 md:p-10"
          style={{
            background: "linear-gradient(180deg, #FFF2D4 42%, #FFE8B2 100%)",
            border: "8px solid white",
            boxShadow: "0px 8px 8px rgba(116,114,160,0.56)",
          }}
        >
          {/* Your Info Title */}
          <h2 className="relative text-[32px] md:text-[40px] font-bold mb-8">
            {/* White stroke layer behind */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                fontFamily: "'MADE Tommy Soft Outline', sans-serif",
                color: "#FFFFFF",
                WebkitTextStroke: "6px",
                filter: "drop-shadow(0px 4px 0px #7472A0)",
              }}
            >
              Your Info
            </span>
            {/* Gradient text on top */}
            <span
              className="relative"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#D48890",
              }}
            >
              Your Info
            </span>
          </h2>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Birthdate */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Address Line 1
              </label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Address Line 2 (Optional) */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Address Line 2{" "}
                <span className="text-[14px] opacity-75">(optional)</span>
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* Country */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* City */}
            <div>
              <label
                className="block text-[24px] md:text-[28px] font-medium mb-2"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  color: "#7472A0",
                }}
              >
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                style={{
                  fontFamily: "'MADE Tommy Soft', sans-serif",
                  background: "white",
                  boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                }}
              />
            </div>

            {/* State/Province and ZIP */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-[24px] md:text-[28px] font-medium mb-2"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#7472A0",
                  }}
                >
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                  }}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label
                  className="block text-[24px] md:text-[28px] font-medium mb-2"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    color: "#7472A0",
                  }}
                >
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full rounded-[12px] px-4 py-3 text-[#6C6EA0] text-lg outline-none"
                  style={{
                    fontFamily: "'MADE Tommy Soft', sans-serif",
                    background: "white",
                    boxShadow: "0px 4px 4px rgba(116,114,160,0.62), inset 2px 4px 8px rgba(116,114,160,0.29)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time to Ship!! */}
        <h3 className="relative text-center text-[36px] md:text-[48px] font-bold mt-8">
          {/* White stroke layer behind */}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              fontFamily: "'MADE Tommy Soft Outline', sans-serif",
              color: "#FFFFFF",
              WebkitTextStroke: "6px",
              filter: "drop-shadow(0px 2px 0px #7472A0)",
            }}
          >
            <u>time to ship!!</u>
          </span>
          {/* Text on top */}
          <span
            className="relative"
            style={{
              fontFamily: "'MADE Tommy Soft', sans-serif",
              color: "#7791E6",
            }}
          >
            <u>time to ship!!</u>
          </span>
        </h3>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {/* OK! Button */}
          <button
            onClick={handleSubmit}
            className="relative rounded-[16px] px-8 py-3 transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #869BE7 0%, #B2BDF1 100%)",
              border: "4px solid white",
              boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
            }}
          >
            <div
              className="absolute inset-[4px] rounded-[12px] pointer-events-none"
              style={{
                background: "linear-gradient(to top, #849AE7 0%, #B2BDF1 68%)",
                boxShadow: "0px 2px 2px rgba(116,114,160,0.33)",
              }}
            />
            <span
              className="relative z-10 text-[24px] md:text-[32px] font-bold"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#4E5DA9",
              }}
            >
              OK!
            </span>
          </button>

          {/* Go Back Button */}
          <button
            onClick={handleGoBack}
            className="relative rounded-[16px] px-6 py-3 transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #6078C4 0%, #6F96DD 100%)",
              border: "4px solid white",
              boxShadow: "0px 4px 0px #C6C7E4, 0px 6px 8px rgba(116,114,160,0.69)",
            }}
          >
            <div
              className="absolute inset-[4px] rounded-[12px] pointer-events-none"
              style={{
                background: "linear-gradient(180deg, #96B5E4 0%, #5790FA 100%)",
                boxShadow: "0px 2px 2px rgba(23,20,88,0.33)",
              }}
            />
            <div
              className="relative z-10 text-center"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#4E5DA9",
              }}
            >
              <p className="text-[16px] md:text-[20px] font-bold">wait...</p>
              <p className="text-[12px] md:text-[14px] font-bold">(go back)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
