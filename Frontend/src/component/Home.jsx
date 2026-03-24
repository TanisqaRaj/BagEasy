import { useState } from "react";
import axios from "axios";

const API = "https://bageasy-backend.onrender.com";

const TRIP_TYPES = ["Beach", "Mountain", "City", "Adventure", "Business", "Cultural", "Road Trip"];
const WEATHER_OPTIONS = ["Sunny", "Rainy", "Cold", "Snowy", "Humid", "Windy", "Mixed"];
const BUDGET_OPTIONS = ["Budget", "Medium", "Luxury"];

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-base font-bold text-darkblue mb-2 border-b border-grey pb-1">{title}</h3>
    {children}
  </div>
);

const TagList = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items?.map((item, i) => (
      <span key={i} className="bg-purple/10 text-darkblue text-xs px-2 py-1 rounded-full border border-purple/20">
        {typeof item === "string" ? item : JSON.stringify(item)}
      </span>
    ))}
  </div>
);

const AlertList = ({ items }) => (
  <ul className="space-y-1">
    {items?.map((item, i) => (
      <li key={i} className="text-sm text-gray-700 flex gap-2">
        <span className="text-purple font-bold">!</span>
        <span><strong>{item.item || item}</strong>{item.reason ? ` — ${item.reason}` : ""}</span>
      </li>
    ))}
  </ul>
);

const ResultPanel = ({ data }) => {
  const [activeTab, setActiveTab] = useState("packing");
  const tabs = [
    { id: "packing", label: "🎒 Packing" },
    { id: "outfit", label: "👗 Outfits" },
    { id: "budget", label: "💰 Budget" },
    { id: "alerts", label: "⚠️ Alerts" },
    { id: "group", label: "👥 Group" },
    { id: "insights", label: "🌍 Insights" },
    { id: "advice", label: "💡 Advice" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Tabs */}
      <div className="flex overflow-x-auto bg-darkblue/5 border-b border-grey">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? "bg-purple text-white"
                : "text-darkblue hover:bg-purple/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        {activeTab === "packing" && (
          <>
            {["clothes", "toiletries", "electronics", "essentials", "accessories"].map((cat) =>
              data.packingList?.[cat]?.length ? (
                <Section key={cat} title={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                  <TagList items={data.packingList[cat]} />
                </Section>
              ) : null
            )}
            {data.weatherSuggestions && (
              <Section title="Weather-Based Additions">
                <TagList items={
                  Array.isArray(data.weatherSuggestions)
                    ? data.weatherSuggestions
                    : Object.values(data.weatherSuggestions).flat()
                } />
              </Section>
            )}
          </>
        )}

        {activeTab === "outfit" && (
          <div className="space-y-3">
            {data.outfitPlanner?.map((day, i) => (
              <div key={i} className="bg-lightblue/10 rounded-lg p-3 border border-grey">
                <p className="font-bold text-darkblue text-sm mb-2">Day {day.day}</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
                  <span><strong>Top:</strong> {day.topWear}</span>
                  <span><strong>Bottom:</strong> {day.bottomWear}</span>
                  <span><strong>Shoes:</strong> {day.footwear}</span>
                  <span><strong>Accessories:</strong> {Array.isArray(day.accessories) ? day.accessories.join(", ") : day.accessories}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "budget" && (
          <>
            <Section title="Must-Have Items">
              <TagList items={data.budgetRecommendations?.mustHave} />
            </Section>
            <Section title="Optional Items">
              <TagList items={data.budgetRecommendations?.optional} />
            </Section>
            <Section title="Budget Tips">
              <ul className="space-y-1">
                {data.budgetRecommendations?.budgetTips?.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-purple">✓</span>{tip}
                  </li>
                ))}
              </ul>
            </Section>
          </>
        )}

        {activeTab === "alerts" && (
          <Section title="Don't Forget">
            <AlertList items={data.dontForgetAlerts} />
          </Section>
        )}

        {activeTab === "group" && (
          data.groupPacking ? (
            <>
              <Section title="Shared Items">
                <TagList items={data.groupPacking.sharedItems} />
              </Section>
              <Section title="Personal Items">
                <TagList items={data.groupPacking.personalItems} />
              </Section>
              <Section title="Responsibilities">
                {data.groupPacking.responsibilities?.map((r, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-sm font-semibold text-darkblue">{r.person}</p>
                    <TagList items={r.items} />
                  </div>
                ))}
              </Section>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">Group packing applies for 2+ people.</p>
          )
        )}

        {activeTab === "insights" && (
          <>
            <Section title="Summary">
              <p className="text-sm text-gray-700">{data.travelInsights?.summary}</p>
            </Section>
            <Section title="Alerts">
              <AlertList items={data.travelInsights?.alerts?.map((a) => ({ item: a }))} />
            </Section>
            <Section title="Travel Advice">
              <ul className="space-y-1">
                {data.travelInsights?.advice?.map((a, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-purple">→</span>{a}</li>
                ))}
              </ul>
            </Section>
          </>
        )}

        {activeTab === "advice" && (
          <>
            <Section title="What to Expect">
              <ul className="space-y-1">
                {data.smartTravelAdvice?.whatToExpect?.map((a, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-purple">→</span>{a}</li>
                ))}
              </ul>
            </Section>
            <Section title="Carry Extra">
              <TagList items={data.smartTravelAdvice?.carryExtra} />
            </Section>
            <Section title="Precautions">
              <ul className="space-y-1">
                {data.smartTravelAdvice?.precautions?.map((p, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-red-500">⚠</span>{p}</li>
                ))}
              </ul>
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [tab, setTab] = useState("ai"); // "ai" | "feedback"
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // AI form state
  const [form, setForm] = useState({
    destination: "", duration: "", tripType: "", weather: "",
    budget: "Medium", numberOfPeople: "1", activities: "",
  });

  // Feedback form state
  const [fb, setFb] = useState({ destination: "", month: "", experience: "" });
  const [fbMsg, setFbMsg] = useState("");

  const handleAI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API}/api/getsuggestion`, form);
      setResult(res.data.output);
    } catch {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/savefeedback`, fb);
      setFbMsg("Thank you for sharing your experience!");
      setFb({ destination: "", month: "", experience: "" });
    } catch {
      setFbMsg("Failed to submit. Please try again.");
    }
  };

  const inputCls = "text-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple/50";
  const labelCls = "block text-gray-700 text-xs font-semibold mb-1";

  return (
    <div className="min-h-screen bg-darkblue flex items-start justify-center w-full p-4 sm:p-6">
      <div className={`grid gap-6 w-full max-w-7xl ${result ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-xl"}`}>
        {/* Left: Form */}
        <div className="bg-lightblue/30 p-6 rounded-xl shadow-lg">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setTab("ai")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${tab === "ai" ? "bg-purple text-white" : "bg-white text-darkblue hover:bg-purple/10"}`}
            >
              🤖 AI Travel Planner
            </button>
            <button
              onClick={() => setTab("feedback")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${tab === "feedback" ? "bg-purple text-white" : "bg-white text-darkblue hover:bg-purple/10"}`}
            >
              ✍️ Share Experience
            </button>
          </div>

          {tab === "ai" ? (
            <form onSubmit={handleAI} className="space-y-3">
              <h2 className="text-xl font-bold text-darkblue mb-3">Plan Your Perfect Trip</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Destination *</label>
                  <input className={inputCls} placeholder="e.g. Goa, Paris" required
                    value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Duration *</label>
                  <input className={inputCls} placeholder="e.g. 5 days" required
                    value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Trip Type</label>
                  <select className={inputCls} value={form.tripType} onChange={(e) => setForm({ ...form, tripType: e.target.value })}>
                    <option value="">Select type</option>
                    {TRIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Expected Weather</label>
                  <select className={inputCls} value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })}>
                    <option value="">Auto-detect</option>
                    {WEATHER_OPTIONS.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Budget</label>
                  <select className={inputCls} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                    {BUDGET_OPTIONS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Number of People</label>
                  <input className={inputCls} type="number" min="1" max="20"
                    value={form.numberOfPeople} onChange={(e) => setForm({ ...form, numberOfPeople: e.target.value })} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Activities Planned</label>
                <input className={inputCls} placeholder="e.g. hiking, swimming, museums"
                  value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button type="submit" disabled={loading}
                className="bg-purple hover:bg-darkblue text-white font-semibold py-2.5 px-4 rounded-md w-full transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Generating Plan...</>
                ) : "✨ Generate Travel Plan"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFeedback} className="space-y-3">
              <h2 className="text-xl font-bold text-darkblue mb-3">Leave a Packing Tip</h2>
              <div>
                <label className={labelCls}>Destination</label>
                <input className={inputCls} placeholder="Where did you go?" required
                  value={fb.destination} onChange={(e) => setFb({ ...fb, destination: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Month of Travel</label>
                <input className={inputCls} type="month" required
                  value={fb.month} onChange={(e) => setFb({ ...fb, month: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Your Experience & Tips</label>
                <textarea className={inputCls} rows="4" placeholder="Share what you wish you had packed..." required
                  value={fb.experience} onChange={(e) => setFb({ ...fb, experience: e.target.value })} />
              </div>
              {fbMsg && <p className="text-sm text-green-700 font-medium">{fbMsg}</p>}
              <button type="submit" className="bg-purple hover:bg-darkblue text-white font-semibold py-2.5 px-4 rounded-md w-full transition-colors">
                Submit Experience
              </button>
            </form>
          )}
        </div>

        {/* Right: Results */}
        {result && <ResultPanel data={result} />}
      </div>
    </div>
  );
};

export default Home;
