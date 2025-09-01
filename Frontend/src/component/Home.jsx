import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const Home = () => {
  const [isexperience, issetExperience] = useState(true);
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [tripMonth, setTripMonth] = useState("");
  const [days, setDays] = useState("");
  const [response, setResponse] = useState("");
  // const token = useSelector((state) => state.auth.token);
  
  //Api call to train AI model
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://bageasy-backend.onrender.com/shareExperience", {
        month,
        destination,
        experience,
      })
      .then((result) => {
        console.log(result);
        if (result.data.message === "success") {
          console.log("record submitted");
        } else {
          alert(result.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  //Api call to get suggestion for trip
  const handleGetSuggestion = async (e) => {
    e.preventDefault();

    const inputData = {
      location,
      tripMonth,
      days,
    };

    try {
      const res = await axios.post(
        "https://bageasy-backend.onrender.com/api/getsuggestion",
        inputData,
      );
      setResponse(res.data.output);
    } catch (error) {
      console.log("Error:", error);
      setResponse("Something went wrong.");
    }
  };

  return (
  <div className="min-h-screen bg-darkblue flex items-center justify-center w-full m-0 p-4 sm:p-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
    
    {/* Left Section (Forms) */}
    <div className="bg-lightblue p-6 sm:p-8 rounded-xl shadow-lg w-full">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          className={`font-semibold py-2 px-4 rounded-md w-full transition duration-200
          ${!isexperience
            ? "bg-lightblue text-darkblue"
            : "bg-purple text-white hover:bg-lightblue"}`}
          onClick={() => issetExperience(false)}
        >
          AI Packing Assistant
        </button>
        <button
          className={`font-semibold py-2 px-4 rounded-md w-full transition duration-200
          ${isexperience
            ? "bg-lightblue text-darkblue"
            : "bg-purple text-white hover:bg-lightblue"}`}
          onClick={() => issetExperience(true)}
        >
          Share your experience
        </button>
      </div>

      {/* Conditional Rendering */}
      {isexperience ? (
        <div>
          <div className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Leave a Packing Tip for the Next Traveler
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Destination Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="destination">
                Destination
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
              />
            </div>

            {/* Month Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="month">
                Month
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            {/* Experience Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="experience">
                Experience
              </label>
              <textarea
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your experience..."
                rows="3"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-purple hover:bg-darkblue text-white font-semibold py-2 px-4 rounded-md w-full transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            Pack Like a Pro — Powered by Bageasy AI
          </div>
          <form className="space-y-4" onSubmit={handleGetSuggestion}>
            {/* Location Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="location">
                Location
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
              />
            </div>

            {/* Month Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="tripMonth">
                Month
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="tripMonth"
                type="month"
                value={tripMonth}
                onChange={(e) => setTripMonth(e.target.value)}
              />
            </div>

            {/* No of Days */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="days">
                No of days
              </label>
              <input
                className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="days"
                type="text"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Number of days..."
              />
            </div>

            {/* AI Response */}
            {response && (
              <div className="mt-4 p-3 bg-gray-100 border rounded">
                <strong>Packing Suggestion:</strong>
                <p className="mt-2 whitespace-pre-wrap">{response}</p>
              </div>
            )}

            {/* Get suggestion Button */}
            <div>
              <button
                type="submit"
                className="bg-purple hover:bg-darkblue text-white font-semibold py-2 px-4 rounded-md w-full transition duration-200"
              >
                Get suggestion
              </button>
            </div>
          </form>
        </div>
      )}
    </div>

    {/* Right Section (Image) */}
    <div className="bg-lightblue rounded-xl shadow-lg w-full overflow-hidden">
      <img
        src="https://media.istockphoto.com/id/1253605251/photo/modern-happy-family-are-glad-of-the-upcoming-summer-trip.jpg?s=612x612&w=0&k=20&c=9M4B2v89cgcv08YvL1R8mEAnYTgPxc04Nwbxs9e6rkc="
        className="h-64 sm:h-full w-full object-cover"
        alt="Travel"
      />
    </div>
  </div>
</div>

  );
};

export default Home;
