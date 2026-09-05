"use client";

import { FormEvent, useId } from "react";
import { Facebook, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import BackButton from "../components/back-button";
import PageHeader from "../components/page-header";
import Button from "../components/button";

const CONTACT_EMAIL = "icpepse@cit.edu";
const FACEBOOK_URL = "https://www.facebook.com/cituicpep";

const inputStyle =
  "mt-2 w-full font-rubik font-normal bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-400 placeholder:font-normal focus:bg-white focus:border-primary1 focus:ring-4 focus:ring-primary1/10 text-gray-800";

const labelStyle = "block font-raleway text-sm font-bold text-gray-700";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea = false,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  textarea?: boolean;
  rows?: number;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={labelStyle}>
        {label} <span className="text-red-500">*</span>
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required
          rows={rows}
          placeholder={placeholder}
          className={`${inputStyle} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          placeholder={placeholder}
          className={inputStyle}
        />
      )}
    </div>
  );
}

export default function ContactPage() {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const subject = String(formData.get("subject") ?? "");
    const message = String(formData.get("message") ?? "");

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        {/* Orbiting glow decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3/4 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-200 lg:h-240 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-1" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-120 lg:h-120 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-240 lg:h-240 bg-linear-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-3" />
        </div>

        <style>{`
          @keyframes orbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(40vw) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(40vw) rotate(-360deg);
            }
          }

          .animate-orbit-1 {
            animation: orbit 20s linear infinite;
          }

          .animate-orbit-2 {
            animation: orbit 20s linear infinite;
            animation-delay: -6.66s;
          }

          .animate-orbit-3 {
            animation: orbit 20s linear infinite;
            animation-delay: -13.33s;
          }
        `}</style>

        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="w-full max-w-6xl mx-auto px-6 pt-38 pb-24 grow">
            <div className="mb-8 flex justify-start">
              <BackButton onClick={() => router.back()} title="Go Back" />
            </div>

            <PageHeader
              badge="Get in Touch"
              title="Contact Us"
              subtitleClassName="max-w-2xl"
              subtitle={
                <>
                  Have questions or any concerns about membership, events, or
                  partnerships — reach us online or send a message through the
                  form.
                </>
              }
            />

            <div className="mx-auto max-w-4xl overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-lg md:grid md:grid-cols-5">
              {/* Stay Connected */}
              <aside className="relative overflow-hidden bg-primary3 p-8 text-white md:col-span-2 md:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5" />

                <h2 className="font-rubik text-2xl font-bold">
                  Stay connected
                </h2>
                <p className="mt-4 font-raleway leading-relaxed text-blue-100">
                  Follow the official chapter channels for announcements,
                  events, and organization updates.
                </p>

                <div className="mt-10 space-y-4">
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-white/20 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white/20">
                      <Facebook className="h-5 w-5" />
                    </span>
                    <span className="font-raleway font-semibold">
                      Facebook
                    </span>
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="group flex items-center gap-4 rounded-2xl border border-white/20 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-white/20">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="break-all font-raleway font-semibold">
                      {CONTACT_EMAIL}
                    </span>
                  </a>
                </div>

                <p className="mt-10 font-raleway text-xs text-blue-200">
                  We typically respond within 1–2 business days.
                </p>
              </aside>

              {/* Send an Inquiry */}
              <section className="p-8 md:col-span-3 md:p-10">
                <h2 className="font-rubik text-2xl font-bold text-primary3">
                  Send an inquiry
                </h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Name"
                      name="name"
                      placeholder="Elijah Montefalco"
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="ejmontefalco@gmail.com"
                    />
                  </div>
                  <Field
                    label="Subject"
                    name="subject"
                    placeholder="What's this all about?"
                  />
                  <Field
                    label="Message"
                    name="message"
                    placeholder="Write your message here..."
                    textarea
                    rows={6}
                  />
                  <Button
                    type="submit"
                    variant="hero"
                    className="group flex w-full items-center justify-center gap-2.5 px-6 py-3.5"
                  >
                    Submit
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                      <Send className="h-3.5 w-3.5" fill="currentColor" />
                    </span>
                  </Button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-[-35px] md:mt-[-80px] relative z-0">
        <Footer />
      </div>
    </div>
  );
}
