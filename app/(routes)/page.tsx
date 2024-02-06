"use client"
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import LoginModal from "../components/LoginModal";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const {status} = useSession()

  if(status==='authenticated')
  {
    return redirect('/Dashboard')
  }

  return (
    <div>
      <Navbar/>
      <div className="relative top-[80px] w-full ">
        <Hero/>
      </div>
    </div>
  );
}
