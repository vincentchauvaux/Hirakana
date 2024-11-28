import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Calendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Générer les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    // Ajouter les jours vides pour l'alignement
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-center text-gray-800">Calendrier d'activités</h1>
          <div className="w-20"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-xl font-semibold mb-4 text-center text-gray-800">
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square p-2 text-center rounded-lg cursor-pointer
                  ${day === null ? 'invisible' : 'hover:bg-blue-50'}
                  ${day === selectedDate.getDate() ? 'bg-blue-100' : 'bg-gray-50'}
                `}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Section des activités */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Activités du {selectedDate.toLocaleDateString('fr-FR')}
            </h2>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-800">Pas encore d'activités prévues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;