import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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

export default function AddBus() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("id");

  const [buses] = useState<Bus[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Bus[]) : [];
    } catch {
      return [];
    }
  });

  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [status, setStatus] = useState<"active" | "maintenance">("active");
  const [start, setStart] = useState("");
  const [startDeparture, setStartDeparture] = useState("");
  const [end, setEnd] = useState("");
  const [endArrival, setEndArrival] = useState("");
  const [stops, setStops] = useState<Stop[]>([]);

  useEffect(() => {
    if (editId) {
      const b = buses.find((x) => x.id === editId);
      if (b) {
        setBusNumber(b.busNumber);
        setDriverName(b.driverName);
        setDriverPhone(b.driverPhone);
        setCapacity(b.capacity);
        setStatus(b.status);
        setStart(b.route.start);
        setStartDeparture(b.route.startDeparture);
        setEnd(b.route.end);
        setEndArrival(b.route.endArrival);
        setStops(b.route.stops);
      }
    }
  }, [editId]);

  const handleAddStop = () => {
    setStops((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", arrivalTime: "", departureTime: "" },
    ]);
  };

  const handleStopChange = (id: string, field: keyof Stop, value: string) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveStop = (id: string) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const resetForm = () => {
    setBusNumber("");
    setDriverName("");
    setDriverPhone("");
    setCapacity("");
    setStatus("active");
    setStart("");
    setStartDeparture("");
    setEnd("");
    setEndArrival("");
    setStops([]);
  };

  const handleSave = () => {
    if (
      !busNumber ||
      !driverName ||
      !driverPhone ||
      !capacity ||
      !start ||
      !end ||
      !startDeparture ||
      !endArrival
    ) {
      alert("Please fill all fields!");
      return;
    }

    const newBus: Bus = {
      id: editId ?? String(Date.now()),
      busNumber,
      driverName,
      driverPhone,
      capacity: Number(capacity),
      status,
      route: { start, startDeparture, stops, end, endArrival },
      addedDate: new Date().toLocaleString(),
    };

    let updatedBuses;
    if (editId) {
      updatedBuses = buses.map((b) => (b.id === editId ? newBus : b));
      alert("Bus updated successfully!");
    } else {
      updatedBuses = [newBus, ...buses];
      alert("Bus added successfully!");
    }

    localStorage.setItem(LS_KEY, JSON.stringify(updatedBuses));
    navigate("/transport");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {editId ? "✏️ Edit Bus" : "🚌 Add New Bus"}
        </h2>
        <button
          onClick={() => navigate("/transport")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        {/* Bus Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            placeholder="Bus Number"
            className="border p-3 rounded-lg outline-none"
          />
          <input
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="Driver Name"
            className="border p-3 rounded-lg outline-none"
          />
          <input
            value={driverPhone}
            onChange={(e) => setDriverPhone(e.target.value)}
            placeholder="Driver Phone"
            className="border p-3 rounded-lg outline-none"
          />
          <input
            value={capacity === "" ? "" : String(capacity)}
            onChange={(e) =>
              setCapacity(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Capacity"
            type="number"
            className="border p-3 rounded-lg outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="border p-3 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Route Info */}
        <h3 className="text-md font-medium mb-2">🗺 Route Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Start Location"
              className="border p-3 rounded-lg outline-none mb-2"
            />
            <input
              type="time"
              value={startDeparture}
              onChange={(e) => setStartDeparture(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />
          </div>
          <div className="flex flex-col">
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="End Location"
              className="border p-3 rounded-lg outline-none mb-2"
            />
            <input
              type="time"
              value={endArrival}
              onChange={(e) => setEndArrival(e.target.value)}
              className="border p-3 rounded-lg outline-none"
            />
          </div>
        </div>

        {/* Stops */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Stops Between</h4>
            <button
              onClick={handleAddStop}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
            >
              + Add Stop
            </button>
          </div>

          {stops.map((s) => (
            <div
              key={s.id}
              className="flex flex-col md:flex-row gap-2 border p-3 rounded-lg mb-2"
            >
              <input
                value={s.name}
                onChange={(e) => handleStopChange(s.id, "name", e.target.value)}
                placeholder="Stop Name"
                className="border p-2 rounded-lg flex-1"
              />
              <input
                type="time"
                value={s.arrivalTime}
                onChange={(e) =>
                  handleStopChange(s.id, "arrivalTime", e.target.value)
                }
                className="border p-2 rounded-lg"
              />
              <input
                type="time"
                value={s.departureTime}
                onChange={(e) =>
                  handleStopChange(s.id, "departureTime", e.target.value)
                }
                className="border p-2 rounded-lg"
              />
              <button
                onClick={() => handleRemoveStop(s.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-lg text-white ${
              editId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editId ? "Update Bus" : "Add Bus"}
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
