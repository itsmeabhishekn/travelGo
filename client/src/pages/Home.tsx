import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchParams, TravelPackage, SortBy } from "../types/booking.types";
import { fetchPackages } from "../services/packageService";
import { getUserProfile } from "../services/user.service";
import PackageCard from "../components/PackageCard";

export type User = {
  avatar?: string;
  name?: string;
  email?: string;
};

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [allPackages, setAllPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const packages = await fetchPackages();
        setAllPackages(packages);
        setFilteredPackages(packages);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUser(null);
        }
      }
    };

    loadPackages();
    loadUser();
  }, []);

  const handleSearch = () => {
    let result = [...allPackages];

    if (searchParams.from) {
      result = result.filter((pkg) =>
        pkg.from.toLowerCase().includes(searchParams.from!.toLowerCase())
      );
    }

    if (searchParams.to) {
      result = result.filter((pkg) =>
        pkg.to.toLowerCase().includes(searchParams.to!.toLowerCase())
      );
    }

    if (searchParams.startDate) {
      result = result.filter(
        (pkg) => new Date(pkg.startDate) >= new Date(searchParams.startDate!)
      );
    }

    if (searchParams.endDate) {
      result = result.filter(
        (pkg) => new Date(pkg.endDate) <= new Date(searchParams.endDate!)
      );
    }

    if (searchParams.sortBy === "price-asc") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (searchParams.sortBy === "price-desc") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredPackages(result);
  };

  const resetFilters = () => {
    setSearchParams({});
    setFilteredPackages(allPackages); // Reset to the original list
  };

  return (
    <div className="min-h-screen p-8">
      <div className="absolute top-4 right-4 flex gap-4 items-center">
        <button
          onClick={() => navigate(user ? "/profile" : "/login")}
          className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Go to profile"
        >
          <img
            src={user?.avatar || PLACEHOLDER_IMAGE}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to TravelGo</h1>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={searchParams.from || ""}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={searchParams.to || ""}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, to: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={searchParams.startDate || ""}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                className="w-full border p-2 rounded"
                value={searchParams.endDate || ""}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <select
              className="border p-2 rounded"
              value={searchParams.sortBy || ""}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  sortBy: e.target.value as SortBy,
                })
              }
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="text-center py-8">Loading packages...</div>
        ) : filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                package={pkg}
                onClick={() => navigate(`/package/${pkg._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg">
              No packages found. Try adjusting your search criteria.
            </p>
            <div className="flex gap-4 justify-center mt-6">
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
        )}
      </div>
    </div>
  );
};

export default Home;
