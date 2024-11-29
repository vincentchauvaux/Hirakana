import React from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Profile = () => {
  const userStats = {
    daysStreak: 5,
    totalCharactersLearned: 25,
    accuracy: 85,
    timeSpent: "12h30",
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
          <Link to="/settings">
            <Settings className="w-6 h-6 text-gray-300 cursor-pointer hover:text-white transition-colors" />
          </Link>
        </header>

        <div className="grid gap-6">
          {/* Informations personnelles */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <span className="text-4xl">👤</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">Nom d'utilisateur</p>
                <p className="text-gray-100 font-medium">Utilisateur</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">Email</p>
                <p className="text-gray-100 font-medium">
                  utilisateur@example.com
                </p>
              </div>
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mt-4">
                Modifier le profil
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Statistiques d'apprentissage
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all">
                <p className="text-gray-400 text-sm">Série actuelle</p>
                <p className="text-2xl font-bold text-blue-400">
                  {userStats.daysStreak} jours
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all">
                <p className="text-gray-400 text-sm">Caractères appris</p>
                <p className="text-2xl font-bold text-green-400">
                  {userStats.totalCharactersLearned}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all">
                <p className="text-gray-400 text-sm">Précision</p>
                <p className="text-2xl font-bold text-purple-400">
                  {userStats.accuracy}%
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all">
                <p className="text-gray-400 text-sm">Temps total</p>
                <p className="text-2xl font-bold text-orange-400">
                  {userStats.timeSpent}
                </p>
              </div>
            </div>

            {/* Graphique de progression */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-100">
                Progression hebdomadaire
              </h3>
              <div className="bg-gray-700 h-48 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors">
                <p className="text-gray-400">Graphique à venir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
