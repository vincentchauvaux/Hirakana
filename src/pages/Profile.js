import React from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  // Données factices pour la démonstration
  const userStats = {
    daysStreak: 5,
    totalCharactersLearned: 25,
    accuracy: 85,
    timeSpent: '12h30',
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-center text-gray-800">Profil</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations personnelles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Nom d'utilisateur</p>
                <p className="font-medium text-gray-800">Utilisateur</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Email</p>
                <p className="font-medium text-gray-800">utilisateur@example.com</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Modifier le profil
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Statistiques d'apprentissage</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Série actuelle</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.daysStreak} jours</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Caractères appris</p>
                <p className="text-2xl font-bold text-green-600">{userStats.totalCharactersLearned}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Précision</p>
                <p className="text-2xl font-bold text-purple-600">{userStats.accuracy}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Temps total</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.timeSpent}</p>
              </div>
            </div>

            {/* Graphique de progression (à implémenter plus tard) */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-800">Progression hebdomadaire</h3>
              <div className="bg-gray-50 h-48 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Graphique à venir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;