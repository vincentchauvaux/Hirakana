import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ScriptSelector from "./components/ScriptSelector";
import CharacterDisplay from "./components/CharacterDisplay";
import AnswerGrid from "./components/AnswerGrid";
import { hiragana, katakana, getAllRomaji } from "./data";
import { generateAnswers } from "./utils";
const App = () => {
  const [currentScript, setCurrentScript] = useState("hiragana");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0); // Niveau actuel
  const [correctAnswers, setCorrectAnswers] = useState(0); // Réponses correctes du niveau
  const [levelProgress, setLevelProgress] = useState(0); // Progression en pourcentage

  const scriptData = currentScript === "hiragana" ? hiragana : katakana;
  const rowsOrder = ["a", "k", "sh", "ts", "n"]; // Ordre des rangées
  const unlockedCharacters = scriptData.filter(
    (char) => rowsOrder.indexOf(char.row) <= currentLevel
  );

  const currentCharacter =
    unlockedCharacters.length > 0
      ? unlockedCharacters[currentCharacterIndex]
      : null;

  const handleScriptChange = (script) => {
    setCurrentScript(script);
    setCurrentLevel(0); // Réinitialiser au niveau 0
    setCorrectAnswers(0); // Réinitialiser le score
    setLevelProgress(0); // Réinitialiser la progression
    setCurrentCharacterIndex(0); // Réinitialiser l'indice au premier caractère
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentCharacter.romaji) {
      setCorrectAnswers((prev) => prev + 1); // Incrémenter les réponses correctes
      setLevelProgress(
        Math.round(((correctAnswers + 1) / unlockedCharacters.length) * 100)
      );

      if (correctAnswers + 1 === unlockedCharacters.length) {
        setCurrentLevel((prev) => prev + 1); // Passer au niveau suivant
        setCorrectAnswers(0); // Réinitialiser le score
        setLevelProgress(0); // Réinitialiser la barre de progression
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
    <div className="w-full bg-gray-300 h-1 rounded-lg overflow-hidden mb-1">
      <div
        className="bg-blue-500 h-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center">
      <Header />
      <ScriptSelector
        currentScript={currentScript}
        onScriptChange={handleScriptChange}
      />
      <ProgressBar progress={levelProgress} />
      {currentCharacter ? (
        <CharacterDisplay character={currentCharacter} />
      ) : (
        <div className="text-center text-red-500">
          Aucun caractère disponible. Veuillez vérifier les données.
        </div>
      )}

      <AnswerGrid
        answers={answers}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswer}
        correctAnswer={currentCharacter.romaji}
      />
    </div>
  );
};

export default App;
