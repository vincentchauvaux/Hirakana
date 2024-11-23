import React from "react";

const CharacterDisplay = ({ character }) => {
  return (
    <div className="flex justify-center mb-12 w-full">
      <div className="w-32 h-32 bg-slate-800 rounded-lg flex items-center justify-center">
        <span className="text-6xl">{character.char}</span>
      </div>
    </div>
  );
};

export default CharacterDisplay;
