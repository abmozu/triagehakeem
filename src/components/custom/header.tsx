import { Ambulance } from "lucide-react";
import React from "react";

const Header: React.FC = () => {
  return (
    <div className="h-fit w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 p-4 shadow-md4 flex">
      <Ambulance className="size-11 ml-0" />
    </div>
  );
};

export default Header;
