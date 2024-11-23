import React from "react";

const ScriptSelector = ({ currentScript, onScriptChange }) => {
  return (
    <div className="flex mb-12 bg-slate-800 rounded-lg overflow-hidden w-full">
      <button
        className={`flex-1 py-3 text-center transition-colors ${
          currentScript === "hiragana" ? "bg-slate-700" : ""
        }`}
        onClick={() => onScriptChange("hiragana")}
      >
        Hiragana
      </button>
      <button
        className={`flex-1 py-3 text-center transition-colors ${
          currentScript === "katakana" ? "bg-slate-700" : ""
        }`}
        onClick={() => onScriptChange("katakana")}
      >
        Katakana
      </button>
    </div>
  );
};

export default ScriptSelector;
