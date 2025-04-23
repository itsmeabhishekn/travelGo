import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-3xl font-bold">Welcome to TravelGo</h1>
      <p className="text-lg">Search and book your next travel package!</p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Home;
