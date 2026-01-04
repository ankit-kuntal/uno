"use client";

import Navbar from "../../component/ui/Navbar";
import SinglePlayerGame from "../game/single/page";

export default function DashBoard() {
  return (
    <div>
      <Navbar />
      <SinglePlayerGame />
    </div>
  );
}