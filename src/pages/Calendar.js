import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Calendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

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
          {/* En-tête du calendrier */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <div className="text-xl font-semibold mb-4 text-center text-gray-100">
              {currentDate.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric",
              })}
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-gray-300"
                >
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
                    ${day === null ? "invisible" : "hover:bg-gray-700"}
                    ${
                      day === selectedDate.getDate()
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }
                    transition-all hover:transform hover:scale-105
                  `}
                  onClick={() =>
                    day &&
                    setSelectedDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )
                  }
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Activités du jour */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">
              Activités du {selectedDate.toLocaleDateString("fr-FR")}
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <p className="text-gray-300">Pas encore d'activités prévues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
