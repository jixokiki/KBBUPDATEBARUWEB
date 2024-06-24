"use client";
import useAuth from "@/app/hooks/useAuth";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const About = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);

  return (
    <div>
      <Navbar />
      <div className="relative mt-20 md:mt-14">
        <Image
          src={"/assets/BG3.jpg"}
          width={1410 / 2}
          height={675 / 2}
          priority
          sizes="(max-width: 768px) 600px, 1410px"
          alt="about page"
          className="relative w-full h-[600px] md:h-screen object-cover object-center mx-auto"
        />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3">
          <h1 className="text-5xl font-extrabold text-gray-950">Product</h1>
        </div>
      </div>
      <div className="p-8 md:p-24 flex flex-col gap-6 text-justify">
        <h2 className="font-bold text-3xl text-center md:text-left">1. Karila Pandan Wangi Super</h2>
        <p>bahan :</p>
        <p>•⁠  ⁠menir (patahan beras pandan wangi) </p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>campuran :</p>
        <p>1. pandan wangi super</p>
        <p>•⁠  pandan wangi </p>
        <p>2. pandan wangi premium 3:1</p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>3. karila 4:1</p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠menir </p>
        <h2 className="font-bold text-3xl text-center md:text-left">2. Karila Pandan Wangi Premium</h2>
        <p>bahan :</p>
        <p>•⁠  ⁠menir (patahan beras pandan wangi) </p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>campuran :</p>
        <p>1. pandan wangi super</p>
        <p>•⁠  pandan wangi </p>
        <p>2. pandan wangi premium 3:1</p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>3. karila 4:1</p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠menir </p>
        <h2 className="font-bold text-3xl text-center md:text-left">3. Karila</h2>
        <p>bahan :</p>
        <p>•⁠  ⁠menir (patahan beras pandan wangi) </p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>campuran :</p>
        <p>1. pandan wangi super</p>
        <p>•⁠  pandan wangi </p>
        <p>2. pandan wangi premium 3:1</p>
        <p>•⁠  ⁠pandan wangi </p>
        <p>•⁠  ⁠muncul </p>
        <p>3. karila 4:1</p>
        <p>•⁠  ⁠ramos </p>
        <p>•⁠  ⁠menir </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
