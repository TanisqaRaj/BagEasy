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
      .post("http://localhost:3000/shareExperience", {
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
        "http://localhost:3000/api/getsuggestion",
        inputData,
      );
      setResponse(res.data.output);
    } catch (error) {
      console.log("Error:", error);
      setResponse("Something went wrong.");
    }
  };

  return (
    <div>
      <div className="min-h-screen  bg-darkblue flex items-center justify-center w-full m-0 p-0 overflow-hidden">
        <div className="bg-lightblue p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto">
          <div className="flex items-center justify-center ">
            <button
              className={`font-semibold py-2 px-4 rounded-md w-full transition duration-200
      ${
        !isexperience
          ? "bg-lightblue text-darkblue"
          : "bg-purple text-white hover:bg-lightblue"
      }`}
              onClick={() => issetExperience(false)}
            >
              AI Packing Assistant
            </button>
            <button
              className={`font-semibold py-2 px-4 rounded-md w-full transition duration-200
      ${
        isexperience
          ? "bg-lightblue text-darkblue"
          : "bg-purple text-white hover:bg-lightblue"
      }`}
              onClick={() => issetExperience(true)}
            >
              Share your experience
            </button>
          </div>
          {isexperience ? (
            <div>
              <div className="text-2xl font-bold text-gray-700">
                Leave a Packing Tip for the Next Traveler
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                {/* Destination Input */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="destination"
                  >
                    Destination
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination"
                  />
                </div>

                {/* Month Input */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="month"
                  >
                    Month
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="month"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="month"
                  />
                </div>

                {/* Experience Input */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="experience"
                  >
                    Experience
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="experience"
                    type="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="experience"
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
              <div className="text-2xl font-bold text-gray-700">
                Pack Like a Pro — Powered by Bageasy AI
              </div>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  handleGetSuggestion(e);
                }}
              >
                {/* Location Input */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location..."
                  />
                </div>

                {/* Month Input */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="tripMonth"
                  >
                    Month
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="TripMonth"
                    type="month"
                    value={tripMonth}
                    onChange={(e) => setTripMonth(e.target.value)}
                    placeholder="month..."
                  />
                </div>

                {/* No of Days */}
                <div>
                  <label
                    className="block text-gray-700 text-sm font-medium mb-1"
                    htmlFor="days"
                  >
                    No of days
                  </label>
                  <input
                    className="text-sm shadow-sm border border-gray-300 rounded-md w-full py-2 sm:py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    id="days"
                    type="text"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="no of days..."
                  />
                </div>

                {/* AI response */}
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

        {/* image section */}
        <div className="bg-lightblue rounded-xl shadow-lg w-full max-w-lg mx-auto overflow-hidden">
          <img
            src="https://media.istockphoto.com/id/1253605251/photo/modern-happy-family-are-glad-of-the-upcoming-summer-trip.jpg?s=612x612&w=0&k=20&c=9M4B2v89cgcv08YvL1R8mEAnYTgPxc04Nwbxs9e6rkc="
            className="h-full w-full"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Home;
