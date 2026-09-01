import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../../../services/productService";
import { getCategories } from "../../../../services/categoryService";
import { getBrands } from "../../../../services/brandService";
import { getLengths } from "../../../../services/lengthService";
import { getNeckPatterns } from "../../../../services/neckPatternService";
import "./productForm.css";

const IMAGE_BASE_URL = "http://localhost:5004";

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category?._id || "");
  const [brand, setBrand] = useState(product?.brand?._id || "");
  const [length, setLength] = useState(product?.length?._id || "");
  const [neckPattern, setNeckPattern] = useState(product?.neckPattern?._id || "");
  const [status, setStatus] = useState(product?.status || "draft");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival || false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(
    product?.images?.map((img) => `${IMAGE_BASE_URL}${img}`) || []
  );

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [lengths, setLengths] = useState([]);
  const [neckPatterns, setNeckPatterns] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch dropdown options on mount
  useEffect(() => {
    let ignore = false;

    const fetchOptions = async () => {
      try {
        const [catRes, brandRes, lenRes, neckRes] = await Promise.all([
          getCategories({ limit: 100, status: "active" }),
          getBrands({ limit: 100, status: "active" }),
          getLengths({ limit: 100, status: "active" }),
          getNeckPatterns({ limit: 100, status: "active" }),
        ]);

        if (!ignore) {
          setCategories(catRes?.data?.data || []);
          setBrands(brandRes?.data?.data || []);
          setLengths(lenRes?.data?.data || []);
          setNeckPatterns(neckRes?.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load dropdown options:", err);
      } finally {
        if (!ignore) setLoadingOptions(false);
      }
    };

    fetchOptions();

    return () => {
      ignore = true;
    };
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    if (slug.trim()) formData.append("slug", slug);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("length", length);
    formData.append("neckPattern", neckPattern);
    formData.append("status", status);
    formData.append("isFeatured", isFeatured);
    formData.append("isNewArrival", isNewArrival);
    formData.append("isBestSeller", isBestSeller);

    // field name MUST be "images" — matches uploadProductImage.array("images", 10)
    images.forEach((file) => formData.append("images", file));

    try {
      if (product) {
        await updateProduct(product._id, formData);
      } else {
        await createProduct(formData);
      }
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="prod-form-overlay">
      <div className="prod-form-card">
        <div className="prod-form-header">
          <h3>{product ? "Edit Product" : "Add Product"}</h3>
          <button type="button" className="prod-form-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {loadingOptions ? (
          <p className="prod-form-loading">Loading options...</p>
        ) : (
          <form onSubmit={handleSubmit} className="prod-form-body">
            <div className="prod-form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Floral Maxi Dress"
                required
              />
            </div>

            <div className="prod-form-group">
              <label>Slug (optional — auto-generated if left blank)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. floral-maxi-dress"
              />
            </div>

            <div className="prod-form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description"
                rows={3}
              />
            </div>

            <div className="prod-form-row">
              <div className="prod-form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prod-form-group">
                <label>Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="prod-form-row">
              <div className="prod-form-group">
                <label>Length</label>
                <select value={length} onChange={(e) => setLength(e.target.value)} required>
                  <option value="">Select length</option>
                  {lengths.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prod-form-group">
                <label>Neck Pattern</label>
                <select
                  value={neckPattern}
                  onChange={(e) => setNeckPattern(e.target.value)}
                  required
                >
                  <option value="">Select neck pattern</option>
                  {neckPatterns.map((n) => (
                    <option key={n._id} value={n._id}>
                      {n.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="prod-form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="prod-form-checkboxes">
              <label className="prod-checkbox-label">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Featured
              </label>
              <label className="prod-checkbox-label">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                />
                New Arrival
              </label>
              <label className="prod-checkbox-label">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                />
                Best Seller
              </label>
            </div>

            <div className="prod-form-group">
              <label>Images {product && "(uploading new images replaces all existing ones)"}</label>
              <div className="prod-form-image-upload">
                {previews.length > 0 && (
                  <div className="prod-form-image-preview-list">
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt={`Preview ${i + 1}`} className="prod-form-image-preview" />
                    ))}
                  </div>
                )}
                <label className="prod-form-file-label">
                  Choose Images
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
                </label>
              </div>
            </div>

            <div className="prod-form-actions">
              <button type="button" className="prod-btn prod-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="prod-btn prod-btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductForm;