import { useEffect, useState } from "react";
import { ProfileHeader } from "../components/ProfileHeader";
import type { UserProfileType } from "../components/ProfileHeader";
import { AddressBook } from "../components/AddressBook";
import { OrderHistory } from "../components/OrderHistory";
import { useNavigate } from "react-router";
import { EditProfileModal } from "../components/EditProfileModal";

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi token để xác thực
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async (newName: string, newAvatar: string) => {
    const token = getToken();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
        method: "PUT", // Gọi method PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          avatar: newAvatar,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Cập nhật lại UI ngay lập tức
      setUser((prev) =>
        prev ? { ...prev, name: newName, avatar: newAvatar } : null
      );

      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // 1. Xóa Token khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      navigate("/signin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Truyền user data xuống Header */}
          <ProfileHeader
            user={user}
            onEditClick={() => setIsEditModalOpen(true)}
            onLogout={handleLogout}
          />

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <AddressBook />
          </div>

          <OrderHistory />
        </div>
      </div>
      {user && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={{ name: user.name, avatar: user.avatar }}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
