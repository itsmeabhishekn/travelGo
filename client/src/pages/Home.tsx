import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchParams, TravelPackage, SortBy } from "../types/booking.types";
import { fetchPackages } from "../services/packageService";
import { getUserProfile } from "../services/user.service";
import PackageCard from "../components/PackageCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiArrowUp,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";

export type User = {
  avatar?: string;
  name?: string;
  email?: string;
  profilePicture?: string;
};

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [allPackages, setAllPackages] = useState<TravelPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchParams({});
    setFilteredPackages(allPackages);
    setShowFilters(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8"
    >
      {/* Floating Profile Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 right-4 z-50"
      >
        <button
          onClick={() => navigate(user ? "/profile" : "/login")}
          className="w-12 h-12 rounded-full overflow-hidden focus:outline-none ring-2 ring-white shadow-lg"
          aria-label="Go to profile"
        >
          <img
            src={user?.profilePicture || user?.avatar || PLACEHOLDER_IMAGE}
            alt="Profile"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
            className="object-cover"
          />
        </button>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10 pt-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Your Perfect Getaway
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of travel packages tailored to your
            dreams
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          variants={fadeIn}
          className="bg-white p-6 rounded-xl shadow-lg mb-10 backdrop-blur-sm bg-opacity-90"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiSearch className="mr-2" /> Find Your Adventure
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg"
            >
              <FiFilter /> {showFilters ? "Hide" : "Filters"}
            </button>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  <FiMapPin className="mr-1" /> From
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Departure city"
                  value={searchParams.from || ""}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, from: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  <FiMapPin className="mr-1" /> To
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Destination"
                  value={searchParams.to || ""}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, to: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  <FiCalendar className="mr-1" /> Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  <FiCalendar className="mr-1" /> End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchParams.endDate || ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700 flex items-center">
                  <FiDollarSign className="mr-1" /> Sort By
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchParams.sortBy || ""}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      sortBy: e.target.value as SortBy,
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <FiSearch className="text-sm" /> Search
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <FiX className="text-sm" /> Reset
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">
              Loading amazing packages for you...
            </p>
          </motion.div>
        ) : filteredPackages.length > 0 ? (
          <>
            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredPackages.map((pkg) => (
                  <motion.div
                    key={pkg._id}
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PackageCard
                      package={pkg}
                      onClick={() => navigate(`/package/${pkg._id}`)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-10 text-gray-500"
            >
              Showing {filteredPackages.length} of {allPackages.length} packages
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-md"
          >
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                No packages found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search criteria or explore our popular
                destinations.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Show All Packages
                </motion.button>
                {!user && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/login")}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition-colors"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/signup")}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
                    >
                      Sign Up
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
