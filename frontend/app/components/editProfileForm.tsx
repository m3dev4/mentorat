"use client"

import type React from "react"
import { useState } from "react"
import { AuthStateStore } from "../api/auth/authStore"
import type { UpdateProfileRequest } from "../types/authType"
import { useUpdateProfile } from "../hooks/auth/useAuth"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Camera, Trash2 } from "lucide-react"

const EditProfileForm = () => {
  const { user, isLoading } = AuthStateStore()
  const { mutate: updateProfile } = useUpdateProfile()
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    bio: user?.bio || "",
    location: {
      country: user?.location?.country || "",
      city: user?.location?.city || "",
      isPublic: user?.location?.isPublic !== false,
    },
    profilePicture: user?.profilePicture || "",
    languages: user?.languages || [],
    timezone: user?.timezone || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-xl">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
            {formData.profilePicture || newProfileImage ? (
              <img
                src={newProfileImage ? URL.createObjectURL(newProfileImage) : formData.profilePicture}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#FF9966]">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-1 bg-[#FF9966] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md hover:bg-[#ff8c4d] transition-colors">
            <Label htmlFor="profile-upload" className="cursor-pointer w-full h-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
              <Input type="file" id="profile-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
            </Label>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-gray-500 mb-4">{user?.email}</p>

          <div className="flex gap-3">
            <Label htmlFor="profile-upload" className="cursor-pointer">
              <div className="bg-[#FF9966] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-[#ff8c4d] transition-colors">
                Changer d'image
              </div>
            </Label>
            <Button
              variant="outline"
              type="button"
              className="border border-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Supprimer
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-medium text-gray-800 border-b pb-3">Informations personnelles</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              Prénom
            </Label>
            <Input
              id="firstName"
              type="text"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={user?.firstName || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Nom
            </Label>
            <Input
              id="lastName"
              type="text"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={user?.lastName || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </Label>
            <Input
              id="bio"
              type="text"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Parlez-nous de vous"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h4 className="text-lg font-medium text-gray-800 border-b pb-3">Adresse</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Numéro et nom de rue
            </Label>
            <Input
              id="address"
              type="text"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={formData.location?.address || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    address: e.target.value,
                  },
                })
              }
              placeholder="123 Rue de Paris"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
              Appartement / Numéro
            </Label>
            <Input
              id="additionalInfo"
              type="text"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent"
              value={formData.location?.additionalInfo || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    additionalInfo: e.target.value,
                  },
                })
              }
              placeholder="Apt 4B"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Ville
            </Label>
            <select
              id="city"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent bg-white"
              value={formData.location?.city || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    city: e.target.value,
                  },
                })
              }
            >
              <option value="">Choisir une ville</option>
              <option value="Paris">Paris</option>
              <option value="Lyon">Lyon</option>
              <option value="Marseille">Marseille</option>
              <option value="Dakar">Dakar</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium text-gray-700">
              Pays
            </Label>
            <select
              id="country"
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF9966] focus:border-transparent bg-white"
              value={formData.location?.country || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: {
                    ...formData.location,
                    country: e.target.value,
                  },
                })
              }
            >
              <option value="">Choisir un pays</option>
              <option value="France">France</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Canada">Canada</option>
              <option value="Belgique">Belgique</option>
            </select>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#FF9966] hover:bg-[#ff8c4d] text-white py-4 rounded-lg font-medium text-base transition-colors duration-200"
        disabled={isLoading}
      >
        {isLoading ? "Mise à jour en cours..." : "Mettre à jour"}
      </Button>
    </form>
  )
}

export default EditProfileForm
