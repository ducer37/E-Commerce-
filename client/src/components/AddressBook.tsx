import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2, Check, X, Phone } from "lucide-react";

// 1. Interface khớp 100% với Prisma Model
interface Address {
  id: number;
  recipientName: string;
  phone: string;
  city: string;
  district: string | null;
  ward: string | null;
  detail: string;
  isDefault: boolean;
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Data khớp với Prisma
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: false,
  });

  const getToken = () => localStorage.getItem("token");

  // --- API CALLS ---
  const fetchAddresses = async () => {
    const token = getToken();
    if (!token) return;
    try {
      // Đổi port 5000
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAddresses(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // --- HANDLERS ---
  const handleEditClick = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      recipientName: addr.recipientName,
      phone: addr.phone,
      city: addr.city,
      district: addr.district || "",
      ward: addr.ward || "",
      detail: addr.detail,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({
      recipientName: "",
      phone: "",
      city: "",
      district: "",
      ward: "",
      detail: "",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    const token = getToken();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    const url = editingId
      ? `${import.meta.env.VITE_API_URL}/addresses/${editingId}`
      : `${import.meta.env.VITE_API_URL}/addresses`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAddresses();
      } else {
        alert("Failed to save address");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  // --- RENDER ---
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading addresses...</div>
    );

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Address Book
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your delivery locations.
            </p>
          </div>
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${
                address.isDefault
                  ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20"
                  : "border-gray-200 bg-white hover:border-indigo-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      address.isDefault
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    {/* Hiển thị Tên người nhận làm tiêu đề chính */}
                    <h3 className="font-bold text-gray-900">
                      {address.recipientName}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-600 mt-0.5">
                        <Check className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100/50 pt-4">
                <p className="text-gray-900">{address.detail}</p>
                <p>
                  {address.ward && `${address.ward}, `}
                  {address.district && `${address.district}, `}
                  {address.city}
                </p>
                <div className="pt-2 mt-2 flex items-center gap-2 text-gray-500">
                  <Phone className="w-3 h-3" />
                  {address.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Recipient Name */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Receiver Name
                </label>
                <input
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  placeholder="John Doe"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Phone Number
                </label>
                <input
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+84..."
                />
              </div>

              {/* Detail (Street) */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Address Detail (Street/House No.)
                </label>
                <input
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.detail}
                  onChange={(e) =>
                    setFormData({ ...formData, detail: e.target.value })
                  }
                  placeholder="123 Nguyen Trai"
                />
              </div>

              {/* Grid: Ward & District */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Ward (Phường/Xã)
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    value={formData.ward}
                    onChange={(e) =>
                      setFormData({ ...formData, ward: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    District (Quận/Huyện)
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  City / Province
                </label>
                <input
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              {/* Checkbox Default */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Set as default address
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 font-medium shadow-lg shadow-black/20"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
