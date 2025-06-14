"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle, Megaphone, UserCircle, X } from "lucide-react"
import ProfilePage from "@/components/profilePage"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState("")
  const [userEmail, setEmail] = useState("")
  const [userRole, setUserRole] = useState("")
  const [showProfile, setShowProfile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUserName(userData.user.username || userData.user.name || userData.user.surname || "User")
      setUserRole(userData.role || "")
      setEmail(userData.user.email)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const closeDropdown = () => {
    setIsOpen(false)
    setShowProfile(false)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {(isOpen || showProfile) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeDropdown} />
      )}

      <div className="flex items-center justify-end px-4 md:mr-6">
        {/* ICONS AND USER SECTION */}
        <div className="flex items-center gap-3 md:gap-6 lg:gap-8 mt-6">
          {/* Message Icon */}
          <div className="bg-white w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full shadow cursor-pointer hover:shadow-md transition-shadow">
            <MessageCircle size={20} className="text-blue-500" />
          </div>

          {/* Announcement Icon with Notification Badge */}
          <div className="relative">
            <div className="bg-white w-10 h-10 md:w-8 md:h-8 flex items-center justify-center rounded-full shadow cursor-pointer hover:shadow-md transition-shadow">
              <Megaphone size={20} className="text-blue-500" />
            </div>
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
              1
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* User Details - Hidden on small screens, shown on medium+ */}
            <div className="hidden md:flex flex-col text-sm">
              <span className="font-medium text-gray-800 truncate max-w-[120px] lg:max-w-none">{userEmail}</span>
              <span className="font-medium text-gray-800 truncate max-w-[120px] lg:max-w-none">{userName}</span>
              <span className="text-xs text-gray-400">{userRole}</span>
            </div>

            <div className="relative">
              {/* User Icon */}
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer relative flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <UserCircle size={28} className="text-gray-500 md:w-6 md:h-6" />
              </div>

              {/* Desktop Dropdown */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-[280px] md:w-[300px] bg-white shadow-lg rounded-lg border z-50 hidden md:block">
                  <div className="py-2">
                    {/* User info in dropdown for mobile context */}
                    <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                      <div className="font-medium text-gray-800 truncate">{userName}</div>
                      <div className="text-sm text-gray-600 truncate">{userEmail}</div>
                      <div className="text-xs text-gray-400">{userRole}</div>
                    </div>

                    <ul className="text-gray-700">
                      <li
                        onClick={() => setShowProfile(!showProfile)}
                        className="cursor-pointer block px-4 py-3 hover:bg-gray-100 transition-colors"
                      >
                        Profile
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>

                    {showProfile && <ProfilePage />}

                    <div className="border-t px-4 py-3 text-xs text-gray-500 text-center">
                      Powered by Enfedam Academy
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Full-Screen Dropdown */}
              {isOpen && (
                <div className="fixed inset-x-4 top-20 bg-white shadow-lg rounded-lg border z-50 md:hidden">
                  <div className="py-4">
                    {/* Close button */}
                    <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-100">
                      <h3 className="font-medium text-gray-800">Account</h3>
                      <button onClick={closeDropdown} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                      </button>
                    </div>

                    {/* User info */}
                    <div className="px-4 py-4 border-b border-gray-100">
                      <div className="font-medium text-gray-800 mb-1">{userName}</div>
                      <div className="text-sm text-gray-600 mb-1">{userEmail}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">{userRole}</div>
                    </div>

                    <ul className="text-gray-700">
                      <li
                        onClick={() => {
                          setShowProfile(!showProfile)
                          setIsOpen(false)
                        }}
                        className="cursor-pointer block px-4 py-4 hover:bg-gray-100 transition-colors text-base"
                      >
                        Profile
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-4 hover:bg-gray-100 transition-colors text-base"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>

                    <div className="border-t px-4 py-3 text-xs text-gray-500 text-center">
                      Powered by Enfedam Academy
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Profile</h2>
            <button
              onClick={() => setShowProfile(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <ProfilePage />
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
