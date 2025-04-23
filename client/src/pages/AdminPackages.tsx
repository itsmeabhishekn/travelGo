import { useEffect, useState } from "react";
import {
  TravelPackage,
  PackageFormData,
  fetchPackages,
  createPackage,
  updatePackage,
  deletePackage,
  handleApiError,
  serviceOptions,
} from "../services/packageService";

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
        ? [...prev.includedServices, value]
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
      } else {
        await createPackage(formData);
      }
      resetForm();
      await loadPackages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
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
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?"))
      return;

    setIsLoading(true);
    setError(null);
    try {
      await deletePackage(id);
      await loadPackages();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Travel Packages</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      )}

      {/* Package Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingPackageId ? "Edit Package" : "Add New Package"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              name="from"
              placeholder="Departure city"
              value={formData.from}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              name="to"
              placeholder="Destination city"
              value={formData.to}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price ($)
            </label>
            <input
              type="number"
              name="basePrice"
              placeholder="0.00"
              value={formData.basePrice}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Included Services:
          </label>
          <div className="flex flex-wrap gap-4">
            {serviceOptions.map((service) => (
              <label key={service} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={service}
                  checked={formData.includedServices.includes(service)}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${
              isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading
              ? "Processing..."
              : editingPackageId
              ? "Update Package"
              : "Add Package"}
          </button>
          {editingPackageId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Package List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Package List</h2>
        {isLoading && packages.length === 0 ? (
          <div className="p-8 text-center">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="p-8 text-center">No packages found</div>
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
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.from}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.to}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                      {new Date(pkg.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${pkg.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.includedServices.map((service) => (
                          <span
                            key={service}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="text-yellow-600 hover:text-yellow-900"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackages;
