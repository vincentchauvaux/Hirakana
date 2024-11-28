// pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bienvenue sur Hirakana</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/learn" className="dashboard-card">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Apprendre</h2>
              <p>Pratiquez les Hiragana et Katakana</p>
            </div>
          </Link>
          <Link to="/calendar" className="dashboard-card">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Calendrier</h2>
              <p>Suivez vos activités d'apprentissage</p>
            </div>
          </Link>
          <Link to="/profile" className="dashboard-card">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-4">Profil</h2>
              <p>Gérez vos informations personnelles</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// pages/Calendar.js
import React from 'react';

const Calendar = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Calendrier d'activités</h1>
        {/* Ici nous pourrons ajouter un composant calendrier */}
      </div>
    </div>
  );
};

export default Calendar;

// pages/Profile.js
import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profil</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Informations personnelles</h2>
            {/* Ici nous pourrons ajouter les informations du profil */}
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
            {/* Ici nous pourrons ajouter les statistiques d'apprentissage */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;