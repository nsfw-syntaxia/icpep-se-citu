"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import InfoSection from "./sections/info";
import AdvisorsSection from "./sections/advisors";
import StudentLeadersSection from "./sections/student-leaders";
import FacultySection from "./sections/faculty";

import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import BackButton from "../components/back-button";
import PageHeader from "../components/page-header";

interface OfficerTerm {
  term: string;
}
interface FacultyMember {
  name: string;
  position: string;
  imageUrl: string;
}

const officerHistory: OfficerTerm[] = [
  { term: "A.Y. 2024 - 2025" },
  { term: "A.Y. 2023 - 2024" },
  { term: "A.Y. 2022 - 2023" },
  { term: "A.Y. 2021 - 2022" },
  { term: "A.Y. 2020 - 2021" },
  { term: "A.Y. 2020 - 2020" },
];

const departmentFaculty: FacultyMember[] = [
  {
    name: "Engr. Roel P. Lauron",
    position: "Department Head",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Jane Doe",
    position: "Professor, Embedded Systems",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. John Smith",
    position: "Assoc. Professor, Networking",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Emily White",
    position: "Professor, VLSI Design",
    imageUrl: "/gle.png",
  },
  {
    name: "Engr. Michael Brown",
    position: "Instructor, IoT",
    imageUrl: "/gle.png",
  },
  {
    name: "Dr. Sarah Green",
    position: "Professor, Signal Processing",
    imageUrl: "/gle.png",
  },
];

const AboutPage: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col">
          <Header />

          <div className="w-full max-w-7xl mx-auto px-6 pt-38">
            <div className="mb-8 flex justify-start">
              <BackButton
                onClick={() => router.push("/")}
                title="Back to Home"
                icon={Home}
              />
            </div>

            <PageHeader
              className="mb-20 text-center"
              badge="About Our Chapter"
              title="The ICpEP SE CIT-U Story"
              subtitleClassName="max-w-3xl"
              subtitle={
                <>
                  Get to know our mission, values, and the dedicated
                  individuals who bring ICPEP SE CIT-U Chapter to life.
                </>
              }
            />

            <InfoSection />
          </div>

          <AdvisorsSection />
          <StudentLeadersSection history={officerHistory} />
          <FacultySection faculty={departmentFaculty} />

          <div className="h-20 md:h-32" />
        </div>
      </main>

      <div className="mt-[-35px] md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
