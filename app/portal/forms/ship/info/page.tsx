"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GradientText from "@/app/components/GradientText";
import { shipProject } from "@/app/forms/actions/shipProject";

function ShipInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    fetch("/api/user/address")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            birthdate: data.birthday || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            country: data.country || "",
            city: data.city || "",
            state: data.state || "",
            zip: data.zip || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch address:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!projectId) {
      alert("Project ID is missing");
      return;
    }

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthdate ||
        !formData.address1 || !formData.city || !formData.state || !formData.zip || !formData.country) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Get ship data from sessionStorage
      const shipDataStr = sessionStorage.getItem("shipData");
      const screenshotDataUrl = sessionStorage.getItem("shipScreenshot");

      if (!shipDataStr) {
        alert("Shipping details are missing. Please go back and fill in the details.");
        setSubmitting(false);
        return;
      }

      const shipData = JSON.parse(shipDataStr);

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("playable", shipData.playableUrl);
      formDataToSend.append("code", shipData.repoUrl);
      formDataToSend.append("github", shipData.githubUsername);

      // Add address information
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("address1", formData.address1);
      formDataToSend.append("address2", formData.address2);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("zip", formData.zip);
      formDataToSend.append("country", formData.country);

      // Convert base64 screenshot to File if exists
      if (screenshotDataUrl) {
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();
        const file = new File([blob], shipData.screenshot || "screenshot.png", { type: blob.type });
        formDataToSend.append("screenshot", file);
      }

      // Call the server action
      const result = await shipProject(formDataToSend, projectId);

      if (result.success) {
        // Clean up sessionStorage
        sessionStorage.removeItem("shipData");
        sessionStorage.removeItem("shipScreenshot");

        // Redirect to portal
        router.push("/portal");
      }
    } catch (error) {
      console.error("Error shipping project:", error);
      alert(`Failed to ship project. Please try again. ${error}`);
      setSubmitting(false);
    }
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
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/background/bunny-tile.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "213px 210px",
        }}
      />

      {/* Ship Title */}
      <div className="flex justify-center pt-8 relative z-10">
        <h1 className="text-[64px] md:text-[96px] text-center">
          <GradientText
            gradient="#89A8EF"
            strokeWidth="10px"
            className="text-[64px] md:text-[96px]"
          >
            Ship
          </GradientText>
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
          <h2 className="text-[32px] md:text-[40px] font-bold mb-8">
            <GradientText
              gradient="#D48890"
              strokeWidth="6px"
              className="text-[32px] md:text-[40px]"
            >
              Your Info
            </GradientText>
          </h2>

          {loading ? (
            <p
              className="text-center text-[20px] py-8"
              style={{
                fontFamily: "'MADE Tommy Soft', sans-serif",
                color: "#7472A0",
              }}
            >
              Loading your info...
            </p>
          ) : (
          <>
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
          </>
          )}
        </div>

        {/* Time to Ship!! */}
        <h3 className="text-center text-[36px] md:text-[48px] font-bold mt-8">
          <GradientText
            gradient="#7791E6"
            strokeWidth="6px"
            className="text-[36px] md:text-[48px]"
          >
            <u>time to ship!!</u>
          </GradientText>
        </h3>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {/* OK! Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className={`relative rounded-[16px] px-8 py-3 transition-transform ${
              submitting || loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
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
              {submitting ? "Shipping..." : "OK!"}
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

export default function ShipInfoPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen relative font-sans pb-12 flex items-center justify-center"
        style={{
          background: "#C0DEFE",
        }}
      >
        <p
          className="text-[24px] font-bold"
          style={{
            fontFamily: "'MADE Tommy Soft', sans-serif",
            color: "#7472A0",
          }}
        >
          Loading...
        </p>
      </div>
    }>
      <ShipInfoContent />
    </Suspense>
  );
}
