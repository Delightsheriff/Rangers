import React from "react";
import Navbar from "@/components/home/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ContactContent = () => {
  return (
    <div className="flex justify-around flex-col mx-4 xl:flex-row">
      <section className="flex flex-col justify-end ">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact us</h2>
        <p className=" mb-8 text-muted-foreground w-[300px] md:w-[400px]">
          Have a question or feedback about the application ? We&apos;re here to
          help!
        </p>
      </section>

      <form className="space-y-6 my-8 ">
        <h3 className="text-2xl font-bold text-center md:text-left mb-8">
          Get in Touch
        </h3>

        <div className="my-4 max-w-[400px] lg:w-[400px]">
          <label className="block text-sm font-medium text-muted-foreground">
            Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full  border-b border-gray-400 bg-transparent focus:outline-none focus:border-black"
          />
        </div>

        <div className="my-4 max-w-[400px] lg:w-[400px]">
          <label className="block text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            className="mt-1 block w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-black"
          />
        </div>

        <div className="my-4 max-w-[400px] lg:w-[400px]">
          <label className="block text-sm font-medium text-muted-foreground">
            Message
          </label>
          <textarea className="mt-1 block w-full border-b border-gray-400 bg-transparent focus:outline-none focus:border-black"></textarea>
        </div>

        <Button className="mt-4">
          <Link href="mailto:splitwise@gmail.com">Send message</Link>
        </Button>
      </form>
    </div>
  );
};

function Contact() {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto my-8">
        <ContactContent />
      </main>
    </div>
  );
}

export default Contact;
