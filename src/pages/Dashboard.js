import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">
          Bienvenue sur Hirakana
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/learn" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Apprendre
              </h2>
              <p className="text-gray-300">
                Pratiquez les Hiragana et Katakana
              </p>
            </div>
          </Link>

          <Link to="/calendar" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Calendrier
              </h2>
              <p className="text-gray-300">
                Suivez vos activités d'apprentissage
              </p>
            </div>
          </Link>

          <Link to="/profile" className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">
                Profil
              </h2>
              <p className="text-gray-300">
                Gérez vos informations personnelles
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
