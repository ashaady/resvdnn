import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductModal from "@/components/admin/ProductModal";
import { products as initialProducts, categories } from "@/data/products";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";

export default function ProductsManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("entrees");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [filterAvailable, setFilterAvailable] = useState("all");

  const filteredProducts = products.filter((p) => {
    const matchCategory = p.category === selectedCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchAvailable =
      filterAvailable === "all" ||
      (filterAvailable === "available" && p.price) ||
      (filterAvailable === "out" && !p.price);

    return matchCategory && matchSearch && matchAvailable;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = (formData: any) => {
    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? formData : p)),
      );
    } else {
      setProducts([...products, formData]);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    setShowModal(false);
  };

  return (
    <AdminLayout
      title="Gestion des Produits"
      searchPlaceholder="Rechercher un produit..."
      onSearch={setSearchQuery}
    >
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-[#6B3E26]">
              Produits
            </h2>
            <p className="text-sm text-[#999999] font-lato mt-1">
              {filteredProducts.length} produits trouvés
            </p>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F58220] hover:bg-[#E06E10] text-white font-playfair font-bold rounded-lg transition-colors"
          >
            <Plus size={20} /> Nouveau Produit
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <p className="text-sm font-playfair font-bold text-[#6B3E26] mb-3">
              Catégorie
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-lato font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#F58220] text-white"
                      : "bg-[#F5F5F5] text-[#6B3E26] hover:bg-[#9C6B4A] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]">
            <p className="text-sm font-playfair font-bold text-[#6B3E26] mb-3">
              Disponibilité
            </p>
            <div className="flex gap-4">
              {[
                { value: "all", label: "Tous" },
                { value: "available", label: "Disponibles" },
                { value: "out", label: "Rupture" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="available"
                    value={option.value}
                    checked={filterAvailable === option.value}
                    onChange={(e) => setFilterAvailable(e.target.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm font-lato text-[#6B3E26]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-[#F58220] text-white px-3 py-1 rounded-full text-xs font-lato font-bold">
                    ⭐ Vedette
                  </div>
                )}
                {product.isTopProduct && (
                  <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-lato font-bold">
                    🏆 Top 5
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="p-2 bg-white rounded-full hover:bg-[#F58220] hover:text-white transition-colors">
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 bg-white rounded-full hover:bg-[#F58220] hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-white rounded-full hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-lato bg-[#F5F5F5] text-[#6B3E26] px-2 py-1 rounded">
                    {categories.find((c) => c.id === product.category)?.label}
                  </span>
                  <button className="text-[#999999] hover:text-[#F58220] transition-colors">
                    <span className="text-lg">{product.price ? "✓" : "✕"}</span>
                  </button>
                </div>

                {/* Name */}
                <h3 className="font-playfair font-bold text-[#6B3E26] line-clamp-2 mb-2">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#999999] font-lato line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Price */}
                <p className="text-lg font-playfair font-bold text-[#F58220] mb-4">
                  {product.price
                    ? `${product.price.toLocaleString()} F`
                    : "N/A"}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 text-sm font-lato border border-[#9C6B4A] text-[#9C6B4A] hover:bg-[#9C6B4A] hover:text-white rounded transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-3 py-2 text-sm font-lato border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-[#999999] font-lato text-lg">
              Aucun produit trouvé
            </p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        product={editingProduct}
        categories={categories}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </AdminLayout>
  );
}
