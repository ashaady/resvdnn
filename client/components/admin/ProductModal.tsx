import { useState } from "react";
import { X, Upload } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured?: boolean;
  isTopProduct?: boolean;
  available?: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  product?: Product;
  categories: Array<{ id: string; label: string }>;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductModal({
  isOpen,
  product,
  categories,
  onClose,
  onSave,
  onDelete,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: `p${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      image: "",
      category: categories[0]?.id || "",
      isFeatured: false,
      isTopProduct: false,
      available: true,
    }
  );

  const [preview, setPreview] = useState<string>(product?.image || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du produit est requis";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }

    if (!formData.image) {
      newErrors.image = "Une image est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  const isEditing = !!product;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6B3E26] to-[#9C6B4A] text-white px-8 py-6 flex items-center justify-between border-b border-[#F58220]">
            <h2 className="text-2xl font-playfair font-bold">
              {isEditing ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <h3 className="font-playfair font-bold text-[#6B3E26] text-sm uppercase">
                  Image du produit
                </h3>

                {/* Image Preview */}
                <div className="border-2 border-dashed border-[#D4AF37] rounded-lg p-4 text-center">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview("");
                          setFormData({ ...formData, image: "" });
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload size={32} className="mx-auto text-[#999999] mb-2" />
                      <p className="text-sm text-[#999999] font-lato">
                        Cliquez ou glissez une image
                      </p>
                    </div>
                  )}
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA]"
                />

                {errors.image && (
                  <p className="text-sm text-red-600 font-lato">{errors.image}</p>
                )}
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-playfair font-bold text-[#6B3E26] mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Hamburger Royal"
                    className="w-full px-4 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA]"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 font-lato mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-playfair font-bold text-[#6B3E26] mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-playfair font-bold text-[#6B3E26] mb-2">
                    Prix (F CFA) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA]"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 font-lato mt-1">
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-playfair font-bold text-[#6B3E26] mb-2">
                Description (max 200 caractères)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  const text = e.target.value.slice(0, 200);
                  setFormData({ ...formData, description: text });
                }}
                placeholder="Décrivez le produit..."
                maxLength={200}
                rows={3}
                className="w-full px-4 py-2 border border-[#D4AF37] rounded-lg text-sm font-lato focus:outline-none focus:border-[#F58220] focus:ring-2 focus:ring-[#FED7AA] resize-none"
              />
              <p className="text-xs text-[#999999] font-lato mt-1">
                {formData.description.length}/200 caractères
              </p>
            </div>

            {/* Checkboxes */}
            <div className="bg-[#F5F5F5] rounded-lg p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFeatured: e.target.checked,
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-lato text-[#6B3E26]">
                  ⭐ Produit vedette
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTopProduct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isTopProduct: e.target.checked,
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-lato text-[#6B3E26]">
                  🏆 Top 5 produits
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      available: e.target.checked,
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-lato text-[#6B3E26]">
                  ✓ Disponible
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="border-t border-[#D4AF37] pt-6 flex gap-4">
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
                      onDelete(formData.id);
                    }
                  }}
                  className="px-6 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-lato font-semibold transition-colors"
                >
                  Supprimer
                </button>
              )}
              <div className="flex-1 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-[#9C6B4A] text-[#9C6B4A] hover:bg-[#9C6B4A] hover:text-white rounded-lg font-lato font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F58220] hover:bg-[#E06E10] text-white rounded-lg font-lato font-semibold transition-colors"
                >
                  {isEditing ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
