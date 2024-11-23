import React from "react";
import { Settings } from "lucide-react";

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-8 w-full">
      <div className="flex items-center gap-2">
        <span className="text-blue-500 font-bold text-2xl">いカ</span>
        <h1 className="text-2xl font-bold">HiraKata</h1>
      </div>
      <Settings className="w-6 h-6 text-white cursor-pointer" />
    </header>
  );
};

export default Header;
