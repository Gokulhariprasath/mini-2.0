import React, { useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    calories: "",
    sleep_hours: "",
    weight: "",
    height: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/analyze", formData);
      setResult(res.data);
    } catch (err) {
      alert("Backend not running 😓");
    } finally {
      setLoading(false);
    }
  };

  const bmi =
    formData.weight && formData.height
      ? (formData.weight / ((formData.height / 100) ** 2)).toFixed(1)
      : null;

  // Chart Data
  const caloriesData = {
    labels: ["Your Intake", "Recommended"],
    datasets: [
      {
        label: "Calories (kcal)",
        data: [formData.calories || 0, 2200],
        backgroundColor: ["#fd1d11ff", "#3bea1cff"],
      },
    ],
  };

  const sleepData = {
    labels: ["Your Sleep", "Ideal Sleep"],
    datasets: [
      {
        label: "Sleep (hours)",
        data: [formData.sleep_hours || 0, 8],
        backgroundColor: ["#fd1d11ff", "#3bea1cff"],
      },
    ],
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      {/* Header */}
      <nav className={`navbar ${darkMode ? "navbar-dark bg-black" : "navbar-light bg-white"} shadow`}>
        <div className="container">
          <span className="navbar-brand fw-bold">🩺 NCD Lifestyle Advisor</span>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </nav>

      {/* Main Card */}
      <div className="container mt-4">
        <div className={`card shadow-lg ${darkMode ? "bg-secondary text-light" : ""}`}>
          <div className="card-body">
            <h4 className="card-title mb-3">Health Inputs</h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Calories Intake</label>
                  <input
                    className="form-control"
                    name="calories"
                    type="number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Sleep Hours</label>
                  <input
                    className="form-control"
                    name="sleep_hours"
                    type="number"
                    step="0.1"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    className="form-control"
                    name="weight"
                    type="number"
                    step="0.1"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Height (cm)</label>
                  <input
                    className="form-control"
                    name="height"
                    type="number"
                    step="0.1"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button className="btn btn-success mt-4 w-100" disabled={loading}>
                {loading ? "Analyzing..." : "Get Advice"}
              </button>
            </form>

            {/* BMI Card */}
            {bmi && (
              <div className="alert alert-info mt-3 text-center">
                <strong>BMI:</strong> {bmi}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="row mt-4 g-4">
            {/* Left Column: Rule-Based + Charts */}
            <div className="col-md-6 d-flex flex-column gap-3">
              {/* Rule-Based Analysis Card */}
              <div className={`card shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                <div className="card-body">
                  <h5>📋 Rule-Based Analysis</h5>
                  <ul>
                    {result.rule_based_analysis.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mini Charts Card */}
              <div className="card shadow p-3">
                <h6>Calories Intake & Sleep</h6>
                <Bar
                  data={caloriesData}
                  options={{
                    responsive: true,
                    animation: { duration: 1200, easing: "easeOutBounce" },
                    plugins: { legend: { position: "top" } },
                  }}
                />
                <Bar
                  data={sleepData}
                  options={{
                    responsive: true,
                    animation: { duration: 1200, easing: "easeOutBounce" },
                    plugins: { legend: { position: "top" } },
                  }}
                />
              </div>
            </div>

            {/* Right Column: AI Advice */}
            <div className="col-md-6">
              <div className={`card h-100 shadow ${darkMode ? "bg-secondary text-light" : ""}`}>
                <div className="card-body">
                  <h5>🤖 AI Advice</h5>
                  <p style={{ whiteSpace: "pre-line" }}>{result.ai_advice}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
