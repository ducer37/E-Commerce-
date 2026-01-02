import { useState } from "react";
import {
  MessageCircle,
  Bot,
  User,
  X,
  ChevronLeft,
  Send,
  Sparkles,
} from "lucide-react";

type ViewState = "MENU" | "CHATBOT" | "ADMIN";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>("MENU");

  // Reset về menu khi đóng
  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => setCurrentView("MENU"), 300); // Reset view sau khi đóng
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* --- CỬA SỔ CHAT (Hiện ra khi isOpen = true) --- */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* 1. VIEW: MENU LỰA CHỌN */}
          {currentView === "MENU" && (
            <div className="flex flex-col h-full">
              <div className="p-6 bg-black text-white text-center">
                <h3 className="text-xl font-bold">Support Center</h3>
                <p className="text-sm text-gray-300 mt-1">
                  How can we help you today?
                </p>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-center gap-4 bg-gray-50">
                <button
                  onClick={() => setCurrentView("CHATBOT")}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">AI Stylist</h4>
                    <p className="text-xs text-gray-500">
                      Get instant product suggestions
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentView("ADMIN")}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-black hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 bg-gray-100 text-gray-900 rounded-full group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chat with Admin</h4>
                    <p className="text-xs text-gray-500">
                      Support for orders & returns
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 2. VIEW: CHATBOT AI (Giao diện Placeholder) */}
          {currentView === "CHATBOT" && (
            <div className="flex flex-col h-full">
              {/* Header Chatbot */}
              <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView("MENU")}
                    className="hover:bg-indigo-500 p-1 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-bold">AI Stylist</span>
                  </div>
                </div>
              </div>

              {/* Body Chat - Nơi bạn tích hợp logic Chatbot của bạn vào đây */}
              <div className="flex-1 p-4 bg-indigo-50/30 overflow-y-auto">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm">
                    Hello! I'm your AI Stylist. Looking for something specific
                    like a "Summer Dress" or "Office Wear"?
                  </div>
                </div>
                {/* --- INSERT YOUR CHATBOT COMPONENTS HERE --- */}
              </div>

              {/* Input Placeholder */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask for suggestions..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="absolute right-2 top-1.5 p-1 text-indigo-600 hover:bg-indigo-50 rounded-full">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIEW: ADMIN CHAT (Giao diện Placeholder) */}
          {currentView === "ADMIN" && (
            <div className="flex flex-col h-full">
              {/* Header Admin */}
              <div className="p-4 bg-black text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView("MENU")}
                    className="hover:bg-gray-800 p-1 rounded"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <User className="w-5 h-5" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                    </div>
                    <div>
                      <span className="font-bold block text-sm">
                        Customer Support
                      </span>
                      <span className="text-[10px] text-gray-300 block leading-none">
                        Typically replies in 5m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Chat - Nơi bạn tích hợp logic Chat với Admin của bạn vào đây */}
              <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-400">Today, 10:23 AM</span>
                </div>
                {/* --- INSERT YOUR ADMIN CHAT COMPONENTS HERE --- */}
              </div>

              {/* Input Placeholder */}
              <div className="p-3 border-t border-gray-100 bg-white">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button className="absolute right-2 top-1.5 p-1 text-black hover:bg-gray-200 rounded-full">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- NÚT BẤM KÍCH HOẠT (TRIGGER BUTTON) --- */}
      <button
        onClick={toggleOpen}
        className="group flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="font-semibold pr-1">Support Messages</span>
          </>
        )}
      </button>
    </div>
  );
}
