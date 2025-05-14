import { AuthStateStore } from "../api/auth/authStore"
import { Button } from "./ui/button"

const ProgressProfile = () => {
  const { user } = AuthStateStore()

  const calculateProfileCompletion = (): number => {
    let completedFields = 0
    const totalFields = 5

    if (user?.firstName) completedFields++
    if (user?.lastName) completedFields++
    if (user?.email) completedFields++
    if (user?.bio) completedFields++
    if (user?.profilePicture) completedFields++

    return Math.min(Math.round((completedFields / totalFields) * 100), 100)
  }

  const profileCompletion = calculateProfileCompletion()

  return (
    <div className="flex flex-col items-center p-2">
      <div className="relative w-32 h-32 mb-4">
        {/* Circle background */}
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#f0f0f0" strokeWidth="3" />
          {/* Progress arc */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#FF9966"
            strokeWidth="3"
            strokeDasharray={`${profileCompletion}, 100`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{
              strokeDasharray: `${profileCompletion}, 100`,
            }}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-2xl font-bold text-[#FF9966]">{profileCompletion}%</span>
        </div>
      </div>

      {/* Text content */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">Profile Complet</h3>
        <p className="text-sm text-gray-500 mt-1">Completer votre profile pour une meilleure expérience</p>
      </div>

      {/* Verification button */}
      <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
        Verifier votre profile
      </Button>
    </div>
  )
}

export default ProgressProfile
