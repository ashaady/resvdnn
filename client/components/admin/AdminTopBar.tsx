import { useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import NotificationSystem from "./NotificationSystem";

interface AdminTopBarProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function AdminTopBar({
  title,
  searchPlaceholder = "Rechercher...",
  onSearch,
}: AdminTopBarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Left - Title */}
        <div className="flex-1 hidden md:block">
          <h1 className="text-2xl font-playfair font-bold text-[#6B3E26]">
            {title}
          </h1>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
            />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-[#D4AF37] font-lato"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Notification System */}
          <NotificationSystem />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="hidden md:text-right">
              <p className="text-sm font-playfair font-bold text-[#6B3E26]">
                {user?.full_name}
              </p>
              <p className="text-xs text-[#999999] font-lato">
                {user?.role === "admin" ? "Administrateur" : "Manager"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">
              {user?.full_name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search - Only visible on mobile */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
          />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 border-[#D4AF37] font-lato"
          />
        </div>
      </div>
    </div>
  );
}
