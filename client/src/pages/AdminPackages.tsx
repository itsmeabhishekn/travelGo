import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ServiceType, TravelPackage } from "../types/booking.types";
import {
  PackageFormData,
  fetchPackages,
  createPackage,
  updatePackage,
  deletePackage,
  handleApiError,
  serviceOptions,
} from "../services/packageService";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiArrowLeft, FiCheck, FiX } from "react-icons/fi";

const AdminPackages = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [formData, setFormData] = useState<PackageFormData>({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    basePrice: "",
    includedServices: [],
  });
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();

  const loadPackages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPackages();
      setPackages(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      includedServices: checked
        ? [...prev.includedServices, value as ServiceType]
        : prev.includedServices.filter((service) => service !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editingPackageId) {
        await updatePackage(editingPackageId, formData);
        setSuccessMessage("Package updated successfully!");
      } else {
        await createPackage(formData);
        setSuccessMessage("Package created successfully!");
      }
      resetForm();
      await loadPackages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      from: "",
      to: "",
      startDate: "",
      endDate: "",
      basePrice: "",
      includedServices: [],
    });
    setEditingPackageId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (pkg: TravelPackage) => {
    setEditingPackageId(pkg._id);
    setFormData({
      from: pkg.from,
      to: pkg.to,
      startDate: pkg.startDate.split("T")[0],
      endDate: pkg.endDate.split("T")[0],
      basePrice: pkg.basePrice.toString(),
      includedServices: pkg.includedServices,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;

    setIsLoading(true);
    setError(null);
    try {
      await deletePackage(id);
      setSuccessMessage("Package deleted successfully!");
      await loadPackages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Admin Dashboard
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-gray-800"
        >
          Manage Travel Packages
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          Add New Package
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r"
          >
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)}>
                <FiX className="text-red-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r"
          >
            <div className="flex justify-between items-center">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)}>
                <FiX className="text-green-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPackageId ? "Edit Package" : "Add New Package"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  placeholder="Departure city"
                  value={formData.from}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  placeholder="Destination city"
                  value={formData.to}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  min={new Date().toISOString().split("T")[0]}
                  max={formData.endDate || undefined}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  name="basePrice"
                  placeholder="0.00"
                  value={formData.basePrice}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Included Services:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={service}
                      checked={formData.includedServices.includes(service)}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                className={`flex items-center px-4 py-2 rounded-lg text-white shadow-md ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } transition-colors`}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    {editingPackageId ? "Update Package" : "Add Package"}
                  </>
                )}
              </motion.button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Package List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Package List</h2>
        </div>

        {isLoading && packages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-pulse flex justify-center">
              <div className="h-8 w-8 bg-indigo-200 rounded-full"></div>
            </div>
            <p className="mt-2 text-gray-600">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No packages found</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Create your first package
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <motion.tr
                    key={pkg._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {pkg.from}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {pkg.to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                      {new Date(pkg.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      ${pkg.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.includedServices.map((service: ServiceType) => (
                          <span
                            key={service}
                            className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(pkg)}
                          className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPackages;
