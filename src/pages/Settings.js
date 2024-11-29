import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Volume2, VolumeX, Bell, BellOff } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true,
    theme: "dark",
    interfaceLanguage: "fr",
    learningSpeed: "normal",
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]:
        typeof prev[setting] === "boolean" ? !prev[setting] : prev[setting],
    }));
  };

  const handleSelect = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

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
        </header>

        <div className="grid gap-6">
          {/* Paramètres généraux */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">
              Paramètres généraux
            </h2>

            {/* Son */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.sound ? (
                    <Volume2 className="w-6 h-6 text-blue-400" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-gray-400" />
                  )}
                  <span>Son</span>
                </div>
                <button
                  onClick={() => handleToggle("sound")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.sound ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sound ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.notifications ? (
                    <Bell className="w-6 h-6 text-blue-400" />
                  ) : (
                    <BellOff className="w-6 h-6 text-gray-400" />
                  )}
                  <span>Notifications</span>
                </div>
                <button
                  onClick={() => handleToggle("notifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications ? "bg-blue-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Langue de l'interface */}
              <div className="space-y-2">
                <label className="block text-gray-300">
                  Langue de l'interface
                </label>
                <select
                  value={settings.interfaceLanguage}
                  onChange={(e) =>
                    handleSelect("interfaceLanguage", e.target.value)
                  }
                  className="w-full bg-gray-700 text-gray-100 rounded-lg p-2 hover:bg-gray-600 transition-colors"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paramètres d'apprentissage */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">
              Paramètres d'apprentissage
            </h2>

            <div className="space-y-6">
              {/* Vitesse d'apprentissage */}
              <div className="space-y-2">
                <label className="block text-gray-300">
                  Vitesse d'apprentissage
                </label>
                <select
                  value={settings.learningSpeed}
                  onChange={(e) =>
                    handleSelect("learningSpeed", e.target.value)
                  }
                  className="w-full bg-gray-700 text-gray-100 rounded-lg p-2 hover:bg-gray-600 transition-colors"
                >
                  <option value="slow">Lente</option>
                  <option value="normal">Normale</option>
                  <option value="fast">Rapide</option>
                </select>
              </div>

              {/* Autres paramètres d'apprentissage à ajouter ici */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
