"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MembershipCard from "./components/membership-card";
import InteractiveCta from "./components/cta";
import PageHeader from "../components/page-header";
import { User, Globe, Zap, ChevronRight } from "lucide-react";
import { type FC, type ReactNode } from "react";

interface MembershipTier {
  planLabel: string;
  title: string;
  price: string;
  description: string;
  benefits: string[];
  isHighlighted: boolean;
  accentColor: "primary" | "steel" | "sky";
  icon: ReactNode;
  buttonIcon: ReactNode;
}

const MembershipPage: FC = () => {
  const isMembershipOpen = true;

  const membershipTiers: MembershipTier[] = [
    {
      planLabel: "Student",
      title: "Student Chapter",
      price: "₱160",
      description: "For active students within the CIT-U chapter.",
      benefits: [
        "Access to exclusive local workshops & seminars.",
        "Discounts on chapter-led events and merchandise.",
        "Opportunity to hold leadership roles in the chapter.",
        "Priority registration for local competitions.",
      ],
      isHighlighted: false,
      accentColor: "steel",
      icon: <User size={24} />,
      buttonIcon: <ChevronRight size={20} />,
    },
    {
      planLabel: "All-Access",
      title: "All-Access Pass",
      price: "₱290",
      description: "The complete package for the dedicated student.",
      benefits: [
        "Includes ALL Student and National benefits.",
        "Significant savings over separate memberships.",
        "Highest priority for limited-slot events.",
        "Exclusive 'members-only' networking channels.",
      ],
      isHighlighted: true,
      accentColor: "primary",
      icon: <Zap size={24} />,
      buttonIcon: <Zap size={20} />,
    },
    {
      planLabel: "National",
      title: "National Membership",
      price: "₱150",
      description: "Connect with the nationwide ICPEP.SE community.",
      benefits: [
        "Official Certificate of Membership.",
        "Access to nationwide conventions and events.",
        "Digital subscription to the national journal.",
        "Broad networking opportunities.",
      ],
      isHighlighted: false,
      accentColor: "sky",
      icon: <Globe size={24} />,
      buttonIcon: <ChevronRight size={20} />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="w-full max-w-7xl mx-auto px-6 pt-38 pb-24 grow">
            <PageHeader
              className="mb-20 text-center"
              badge={isMembershipOpen ? "Join Our Community" : "Membership Closed"}
              title="Unlock Your Potential"
              subtitleClassName="max-w-3xl"
              subtitle={
                <>
                  Become a member and gain access to exclusive events,
                  workshops, and resources designed to boost your career in
                  computer engineering.
                </>
              }
            />

            <div className="w-full">
              <div className="group flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-8 lg:pt-12">
                <div className="order-2 lg:order-1 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-mr-8 group-hover:lg:-translate-x-8">
                  <MembershipCard
                    {...membershipTiers[0]}
                    isOpen={isMembershipOpen}
                  />
                </div>
                <div className="order-1 lg:order-2 w-full max-w-md lg:w-1/3 z-10 transition-all duration-500 ease-out lg:scale-110 group-hover:lg:scale-105">
                  <MembershipCard
                    {...membershipTiers[1]}
                    isOpen={isMembershipOpen}
                  />
                </div>
                <div className="order-3 lg:order-3 w-full max-w-md lg:w-1/3 transition-all duration-500 ease-out lg:-ml-8 group-hover:lg:translate-x-8">
                  <MembershipCard
                    {...membershipTiers[2]}
                    isOpen={isMembershipOpen}
                  />
                </div>
              </div>
            </div>

            <InteractiveCta isOpen={isMembershipOpen} />
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default MembershipPage;
