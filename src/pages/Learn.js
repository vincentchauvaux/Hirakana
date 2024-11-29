import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScriptSelector from "../components/ScriptSelector";
import CharacterDisplay from "../components/CharacterDisplay";
import AnswerGrid from "../components/AnswerGrid";
import { hiragana, katakana, getAllRomaji } from "../data";
import { generateAnswers } from "../utils";
import { Settings } from "lucide-react";

const Learn = () => {
  const [currentScript, setCurrentScript] = useState("hiragana");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);

  const scriptData = currentScript === "hiragana" ? hiragana : katakana;
  const rowsOrder = ["a", "k", "s", "t", "n"];
  const unlockedCharacters = scriptData.filter(
    (char) => rowsOrder.indexOf(char.row) <= currentLevel
  );

  const currentCharacter =
    unlockedCharacters.length > 0
      ? unlockedCharacters[currentCharacterIndex]
      : null;

  const handleScriptChange = (script) => {
    setCurrentScript(script);
    setCurrentLevel(0);
    setCorrectAnswers(0);
    setLevelProgress(0);
    setCurrentCharacterIndex(0);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentCharacter.romaji) {
      setCorrectAnswers((prev) => prev + 1);
      setLevelProgress(
        Math.round(((correctAnswers + 1) / unlockedCharacters.length) * 100)
      );

      if (correctAnswers + 1 === unlockedCharacters.length) {
        setCurrentLevel((prev) => prev + 1);
        setCorrectAnswers(0);
        setLevelProgress(0);
      }

      setTimeout(() => {
        if (unlockedCharacters.length > 0) {
          setCurrentCharacterIndex(
            Math.floor(Math.random() * unlockedCharacters.length)
          );
        }
        setSelectedAnswer(null);
      }, 400);
    } else {
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 800);
    }
  };

  useEffect(() => {
    const allRomaji = getAllRomaji(scriptData);
    const newAnswers = generateAnswers(currentCharacter.romaji, allRomaji);
    setAnswers(newAnswers);
    setSelectedAnswer(null);
  }, [currentCharacter, currentScript, scriptData]);

  const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
      <div
        className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 w-full">
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <span className="text-2xl">←</span>
            <span className="text-2xl font-bold">Retour</span>
          </Link>
          <Link to="/settings">
            <Settings className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition-colors" />
          </Link>
        </header>

        <div className="grid gap-4">
          {/* Sélecteur de script - Version plus compacte */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <div className="flex bg-slate-800 rounded-md overflow-hidden w-full">
              <button
                onClick={() => handleScriptChange("hiragana")}
                className={`flex-1 py-2 text-sm text-center transition-colors ${
                  currentScript === "hiragana" ? "bg-slate-700" : ""
                }`}
              >
                Hiragana
              </button>
              <button
                onClick={() => handleScriptChange("katakana")}
                className={`flex-1 py-2 text-sm text-center transition-colors ${
                  currentScript === "katakana" ? "bg-slate-700" : ""
                }`}
              >
                Katakana
              </button>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <p className="text-gray-400">Niveau {currentLevel + 1}</p>
                <p className="text-gray-400">{levelProgress}%</p>
              </div>
              <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Zone de jeu */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <div className="flex flex-col items-center">
              {currentCharacter ? (
                <>
                  <div className="mb-8 transform hover:scale-105 transition-transform">
                    <CharacterDisplay character={currentCharacter} />
                  </div>
                  <div className="w-full max-w-2xl">
                    <AnswerGrid
                      answers={answers}
                      onAnswerSelect={handleAnswerSelect}
                      selectedAnswer={selectedAnswer}
                      correctAnswer={currentCharacter.romaji}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center text-red-400 p-4 bg-red-900 bg-opacity-50 rounded-lg">
                  Aucun caractère disponible. Veuillez vérifier les données.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
