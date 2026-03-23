"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../../components/Sidebar";
import BunnyTile from "../../components/BunnyTile";
import GradientText from "../../components/GradientText";
import ReferralCapture from "../../components/ReferralCapture";

export default function Travel() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const contentOffset = isMobile ? "0px" : isSidebarOpen ? "clamp(360px, 28vw, 600px)" : "140px";

  return (
    <div
      className="font-sans min-h-screen relative"
      style={{ backgroundColor: "#C0DEFE" }}
    >
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <BunnyTile />
      <Sidebar onStateChange={setIsSidebarOpen} />

      {/* Main Content */}
      <main
        className="relative z-10 transition-[margin-left] duration-300 p-4 md:p-8 lg:p-12 pt-16 md:pt-8 flex flex-col items-center"
        style={{ 
          marginLeft: contentOffset, 
          marginRight: isMobile ? "0px" : "32px" 
        }}
      >
        <div
          className="flex justify-center mb-6 md:mb-8 w-full transition-all duration-300"
          style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}
        >
          <h1 className="text-[48px] md:text-[72px] leading-[60px] md:leading-[90px] text-center">
            <GradientText
              gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)"
              strokeWidth="10px"
            >
              Travel Guide
            </GradientText>
          </h1>
        </div>

        <div className="w-full text-left space-y-8" style={{ maxWidth: isSidebarOpen ? "960px" : "1120px" }}>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Receiving an Invitation
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              To receive an invitation to Sleepover you must:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[16px] md:text-[20px]" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              <li>Complete 30 verified hours of coding</li>
              <li>Ship them to sleepover.hackclub.com</li>
            </ul>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              You must be between the ages of 13-18 and identify as a girl to attend Sleepover.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              You must meet the requirements stated above by April 20th in order to receive an invitation. Invites will be sent on a rolling basis from now until the event — the earlier you meet these requirements, the earlier you can receive an invitation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Getting to the Venue
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Hack Club&apos;s Sleepover is hosted in Downtown Chicago. Attendees are expected to get to the venue on their own.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              No one except attendees and HQ Adult Staff will be allowed to enter Sleepover.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              For teens who require airport pickup, Hack Club Staff will be stationed at Chicago O&apos;Hare and will accompany teenagers on Chicago Public Transit to the venue. More information on this coming soon for confirmed participants!
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Due to safety reasons, we will only be able to share the venue&apos;s address with confirmed attendees.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Booking Travel
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              All participants are expected to book their own travel to Sleepover. Limited travel grants are available. If a participant qualifies for a travel grant they must ship a project at Sleepover (working demo link and public GitHub repository) to receive reimbursement, which will be done through HCB.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Arrival/Departure Times
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Please book your travel to arrive in Chicago between 11:00am CST and 4:00pm CST on April 24th, 2026.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Please book your travel to leave Chicago after 4pm CST on April 26th, 2026. If you need to arrive at the venue later (e.g. lack of flights) or leave earlier, please let us know via athena@hackclub.com.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              If you&apos;re an international attendee and the only flight that works for you arrives on April 23rd, 2026, or leaves after April 26th, 2026, please email athena@hackclub.com before booking your flight so we can try to accommodate your needs. We are unable to accommodate early arrivals before 3pm if not previously negotiated with organizers.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              You can book a flight before receiving the invitation at your own risk. If you arrive at the event and do not have an invitation or a signed waiver we are unable to let you into the hackathon. We are unable to reimburse any travel or refund feathers if you purchase a ticket and have not received an invitation to Sleepover or are unable to travel to Sleepover (i.e. denied visa/esta).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Travel Grants
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Travel grants are an important resource for teenagers whose families otherwise wouldn&apos;t have the means to pay for a flight to Sleepover.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              You may not apply for a travel grant if you live within 250 miles of Chicago. Check out gas.hackclub.com instead!
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Travel Grants may only go towards you (the attendee). No one else!
            </p>
            <h3 className="text-[20px] md:text-[28px] mt-4 mb-2">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="4px">
                How they work
              </GradientText>
            </h3>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Anyone who receives an invitation to Sleepover can apply for a travel grant. Here&apos;s what the application process will look like:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[16px] md:text-[20px]" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              <li>When you apply, you will be prompted to answer some short questions. The goal of these questions is for us to get to know you a bit and gain a better understanding of why you are applying.</li>
              <li>We will review your application on a rolling basis.</li>
              <li>If you qualify for a travel grant, we ask that you purchase your travel in advance. After Sleepover, we will send out a flight reimbursement form to those who have received travel grants.</li>
              <li>You must ship a project during Sleepover to receive reimbursement for your travel!</li>
            </ul>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              Please only apply for a travel grant if you need it! We have a very limited amount.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              The standard maximum of these grants is:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[16px] md:text-[20px]" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              <li>$300 USD for North America</li>
              <li>$600 USD internationally</li>
            </ul>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              More feathers, more grants!! You can alternatively purchase more funds to be added to your travel grant in the shop. 1 feather will get you 5 dollars worth of flight grants, and you can stack them as long as you have the feathers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-[24px] md:text-[36px] mb-3">
              <GradientText gradient="linear-gradient(180deg, #B7C1F2 0%, #89A8EF 100%)" strokeWidth="6px">
                Travelling Internationally
              </GradientText>
            </h2>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              If you are a citizen of a country other than the United States, you may need to apply for an ESTA (Visa Waiver Program) or B1/B2 US visa based on your country of origin.
            </p>
            <p className="text-[16px] md:text-[20px] leading-relaxed" style={{ fontFamily: "'MADE Tommy Soft', sans-serif", fontWeight: "bold", color: "#6C6EA0", textShadow: "0px 2px 4px rgba(108, 110, 160, 0.3)" }}>
              To request a visa invitation letter, check out visas.hackclub.com
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
