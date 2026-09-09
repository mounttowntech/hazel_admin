import { useEffect, useMemo, useState } from "react";

import {
  getAllBannerProducts,
  createBannerProduct,
  updateBannerProduct,
  deleteBannerProduct,
} from "../../../services/bannerproductService";

import {
  getAllBanners,
  getBannerImageUrl,
} from "../../../services/bannerService";

import { getProducts } from "../../../services/productService";

import "./BannerProductList.css";

// ==========================================================
// DATE FORMAT
// ==========================================================

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================================
// PRODUCT DISPLAY HELPERS
// productService.getProducts() doesn't expose label/image
// helpers, so they live here. Field names are guessed from
// common conventions (productName, media[]) — adjust if your
// actual product schema uses different keys.
// ==========================================================

const getProductLabel = (product) => {
  if (!product) return "Unknown product";
  return (
    product.productName ||
    product.name ||
    product.title ||
    `Product #${product._id?.slice(-6) || ""}`
  );
};

const getProductImage = (product) => {
  if (!product) return "";

  // top-level media array (from createProduct's "media" field)
  const topLevel = Array.isArray(product.media) ? product.media[0] : null;
  // or the first color variant's first media item
  const variantLevel = Array.isArray(product.variants)
    ? product.variants[0]?.media?.[0]
    : null;

  const media = topLevel || variantLevel;
  const url = typeof media === "string" ? media : media?.url;

  if (!url) return "";
  if (url.startsWith("http")) return url;

  return url;
};

// ==========================================================
// BANNER PRODUCT LIST
// ==========================================================

const BannerProductList = () => {
  const [mappings, setMappings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);

  const [bannerFilter, setBannerFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ========================================================
  // TOAST
  // ========================================================

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ========================================================
  // FETCH ALL DATA
  // ========================================================

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const [mappingRes, bannerRes, productRes] =
          await Promise.all([
            getAllBannerProducts(),
            getAllBanners(),
            getProducts(),
          ]);

        if (cancelled) return;

        // getAllBannerProducts, getAllBanners, and getProducts
        // all return the raw axios response, so the body is
        // one level deeper: res.data is the { success, data }
        // payload, res.data.data is the actual array.
        setMappings(mappingRes?.data?.data || []);
        setBanners(bannerRes?.data?.data || []);
        setProducts(productRes?.data?.data || []);
      } catch (err) {
        if (cancelled) return;

        showToast(
          "error",
          err?.response?.data?.message ||
            "Failed to load banner products"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ========================================================
  // MODAL HANDLERS
  // ========================================================

  const openAddModal = () => {
    setEditingMapping(null);
    setModalOpen(true);
  };

  const openEditModal = (mapping) => {
    setEditingMapping(mapping);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMapping(null);
  };

  // ========================================================
  // HANDLE SAVED
  // ========================================================

  const handleSaved = (savedMapping, mode) => {
    if (mode === "create") {
      setMappings((prev) => [
        savedMapping,
        ...prev,
      ]);

      showToast(
        "success",
        "Product assigned to banner successfully"
      );
    } else {
      setMappings((prev) =>
        prev.map((m) =>
          m._id === savedMapping._id
            ? savedMapping
            : m
        )
      );

      showToast(
        "success",
        "Mapping updated successfully"
      );
    }

    closeModal();
  };

  // ========================================================
  // DELETE
  // ========================================================

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deleteBannerProduct(deleteTarget._id);

      setMappings((prev) =>
        prev.filter(
          (m) => m._id !== deleteTarget._id
        )
      );

      showToast(
        "success",
        "Product removed from banner"
      );

      setDeleteTarget(null);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message ||
          "Failed to remove mapping"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ========================================================
  // FILTERED MAPPINGS
  // ========================================================

  const filteredMappings = useMemo(() => {
    if (!bannerFilter) {
      return mappings;
    }

    return mappings.filter(
      (m) =>
        (m.bannerId?._id || m.bannerId) ===
        bannerFilter
    );
  }, [mappings, bannerFilter]);

  // ========================================================
  // TABLE ROWS
  // ========================================================

  const rows = useMemo(
    () =>
      filteredMappings.map((m, index) => {
        const banner = m.bannerId;
        const product = m.productId;

        return (
          <tr key={m._id}>
            <td>{index + 1}</td>

            {/* BANNER */}
            <td>
              <div className="bp-cell-entity">
                <img
                  className="bp-thumb"
                  src={getBannerImageUrl(
                    banner?.imageURL
                  )}
                  alt={
                    banner?.bannerType ||
                    "banner"
                  }
                />

                <span
                  className={`banner-type-badge banner-type-badge--${banner?.bannerType}`}
                >
                  {banner?.bannerType ||
                    "Unknown"}
                </span>
              </div>
            </td>

            {/* PRODUCT */}
            <td>
              <div className="bp-cell-entity">
                <img
                  className="bp-thumb"
                  src={getProductImage(product)}
                  alt=""
                />

                <span className="bp-entity-name">
                  {getProductLabel(product)}
                </span>
              </div>
            </td>

            {/* DATE */}
            <td>
              {formatDate(m.createdAt)}
            </td>

            {/* ACTIONS */}
            <td>
              <div className="bp-actions">
                <button
                  className="link-btn link-btn--edit"
                  onClick={() =>
                    openEditModal(m)
                  }
                >
                  Edit
                </button>

                <button
                  className="link-btn link-btn--delete"
                  onClick={() =>
                    setDeleteTarget(m)
                  }
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        );
      }),
    [filteredMappings]
  );

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="bp-page">

      {/* HEADER */}
      <div className="bp-page__header">
        <h1 className="bp-page__title">
          Banner Products
        </h1>

        <button
          className="btn-primary"
          onClick={openAddModal}
        >
          + Assign Product
        </button>
      </div>

      <p className="bp-page__subtitle">
        Attach products to a banner so they show
        up when the banner is featured.
      </p>

      {/* FILTER */}
      <div className="bp-filter-bar">
        <select
          className="form-select"
          value={bannerFilter}
          onChange={(e) =>
            setBannerFilter(e.target.value)
          }
        >
          <option value="">
            All banners
          </option>

          {banners.map((b) => (
            <option
              key={b._id}
              value={b._id}
            >
              {b.bannerType} —{" "}
              {b._id.slice(-6)}
            </option>
          ))}
        </select>

        {bannerFilter && (
          <button
            className="bp-filter-clear"
            onClick={() =>
              setBannerFilter("")
            }
          >
            Clear filter
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bp-table-card">
        {loading ? (
          <div className="bp-loading">
            Loading banner products...
          </div>
        ) : filteredMappings.length === 0 ? (
          <div className="bp-empty">
            No products assigned yet. Click
            "+ Assign Product" to link a product
            to a banner.
          </div>
        ) : (
          <table className="bp-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>BANNER</th>
                <th>PRODUCT</th>
                <th>CREATED DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {rows}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <BannerProductFormModal
          mapping={editingMapping}
          banners={banners}
          products={products}
          onClose={closeModal}
          onSaved={handleSaved}
          onError={(msg) =>
            showToast("error", msg)
          }
        />
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="bp-modal-overlay"
          onClick={() =>
            !deleting &&
            setDeleteTarget(null)
          }
        >
          <div
            className="bp-modal confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="confirm-modal__icon">
              !
            </div>

            <h2 className="bp-modal__title">
              Remove this product?
            </h2>

            <p className="confirm-modal__text">
              This will unassign{" "}
              {getProductLabel(
                deleteTarget.productId
              )}{" "}
              from the{" "}
              {deleteTarget.bannerId
                ?.bannerType || "selected"}{" "}
              banner.
            </p>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`bp-toast bp-toast--${toast.type}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

// ==========================================================
// ADD / EDIT MODAL
// ==========================================================

const BannerProductFormModal = ({
  mapping,
  banners,
  products,
  onClose,
  onSaved,
  onError,
}) => {
  const isEdit = Boolean(mapping);

  const [bannerId, setBannerId] = useState(
    mapping?.bannerId?._id ||
      mapping?.bannerId ||
      ""
  );

  const [productId, setProductId] = useState(
    mapping?.productId?._id ||
      mapping?.productId ||
      ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!bannerId || !productId) {
      setError(
        "Please select both a banner and a product"
      );
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        const res =
          await updateBannerProduct(
            mapping._id,
            {
              bannerId,
              productId,
            }
          );

        onSaved(res.data.data, "update");
      } else {
        const res =
          await createBannerProduct({
            bannerId,
            productId,
          });

        onSaved(res.data.data, "create");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(msg);
      onError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ========================================================
  // MODAL UI
  // ========================================================

  return (
    <div
      className="bp-modal-overlay"
      onClick={() =>
        !saving && onClose()
      }
    >
      <div
        className="bp-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2 className="bp-modal__title">
          {isEdit
            ? "Edit Assignment"
            : "Assign Product to Banner"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* BANNER */}
          <div className="form-group">
            <label className="form-label">
              Banner
            </label>

            <select
              className="form-select"
              value={bannerId}
              onChange={(e) =>
                setBannerId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select a banner
              </option>

              {banners.map((b) => (
                <option
                  key={b._id}
                  value={b._id}
                >
                  {b.bannerType} —{" "}
                  {b._id.slice(-6)}
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT */}
          <div className="form-group">
            <label className="form-label">
              Product
            </label>

            <select
              className="form-select"
              value={productId}
              onChange={(e) =>
                setProductId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select a product
              </option>

              {products.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                >
                  {getProductLabel(p)}
                </option>
              ))}
            </select>
          </div>

          {/* ERROR */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Assign Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerProductList;