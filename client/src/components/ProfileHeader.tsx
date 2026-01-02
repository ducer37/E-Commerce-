import { ImageWithFallback } from "./imagefallback";
import { Edit, Calendar, Mail, LogOut } from "lucide-react";

// Định nghĩa kiểu dữ liệu User cho Frontend
export interface UserProfileType {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
}

interface ProfileHeaderProps {
  user: UserProfileType | null;
  onEditClick: () => void;
  onLogout: () => void;
}

export function ProfileHeader({
  user,
  onEditClick,
  onLogout,
}: ProfileHeaderProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (!user) {
    return <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>

      <div className="px-8 pb-8">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-end -mt-12 gap-6">
          <div className="relative">
            <div className="p-1.5 bg-white rounded-full shadow-sm">
              <ImageWithFallback
                src={user.avatar || ""} // Nếu null thì ImageWithFallback sẽ xử lý
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>

          <div className="flex-1 w-full sm:w-auto pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {user.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>

              <button
                onClick={onEditClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-600 border border-gray-200 rounded-full text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
