import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Stop = {
  id: string;
  name: string;
  arrivalTime: string;
  departureTime: string;
};

type Bus = {
  id: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: "active" | "maintenance";
  route: {
    start: string;
    startDeparture: string;
    stops: Stop[];
    end: string;
    endArrival: string;
  };
  addedDate: string;
};

const LS_KEY = "transport_buses_v5";

export default function TransportMain() {
  const [buses, setBuses] = useState<Bus[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Bus[]) : [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(buses));
  }, [buses]);

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;
    setBuses((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">🚌 Transport — Bus Management</h1>
        <button
          onClick={() => navigate("/transport/add-bus")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Bus
        </button>
      </div>

      {/* Bus Cards */}
      {buses.length === 0 ? (
        <div className="text-gray-500">No buses added yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((b) => (
            <div key={b.id} className="bg-white shadow rounded-xl p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{b.busNumber}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    b.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <p className="text-sm mt-2">
                <strong>Driver:</strong> {b.driverName}
              </p>
              <p className="text-sm">
                <strong>Contact No:</strong> {b.driverPhone}
              </p>
              <p className="text-sm">
                <strong>Capacity:</strong> {b.capacity}
              </p>

              {/* Route Button */}
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => navigate(`/transport/route/${b.id}`)}
                  className="px-2 py-2 rounded-md text-blue-700 border hover:bg-blue-50"
                >
                  👀 View Routes
                </button>
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigate(`/transport/add-bus?id=${b.id}`)}
                  className="px-3 py-1 rounded-md text-yellow-700 border hover:bg-yellow-50"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-3 py-1 rounded-md text-red-700 border hover:bg-red-50"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
