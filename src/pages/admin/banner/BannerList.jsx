
import { useEffect, useMemo, useState } from "react";

import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerImageUrl,
} from "../../../services/bannerService";

import "./BannerList.css";

const BANNER_TYPES = ["offer", "festival", "dailyUsage"];

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==========================================================
  // FETCH BANNERS
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const loadBanners = async () => {
      try {
        const res = await getAllBanners();

        if (isMounted) {
          setBanners(res?.data?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          showToast(
            "error",
            err?.response?.data?.message ||
              "Failed to load banners"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBanners();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // MODAL HANDLERS
  // ==========================================================

  const openAddModal = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBanner(null);
  };

  // ==========================================================
  // SAVE HANDLER
  // ==========================================================

  const handleSaved = (savedBanner, mode) => {
    if (mode === "create") {
      setBanners((prev) => [
        savedBanner,
        ...prev,
      ]);

      showToast(
        "success",
        "Banner created successfully"
      );
    } else {
      setBanners((prev) =>
        prev.map((b) =>
          b._id === savedBanner._id
            ? savedBanner
            : b
        )
      );

      showToast(
        "success",
        "Banner updated successfully"
      );
    }

    closeModal();
  };

  // ==========================================================
  // DELETE HANDLER
  // ==========================================================

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deleteBanner(deleteTarget._id);

      setBanners((prev) =>
        prev.filter(
          (b) => b._id !== deleteTarget._id
        )
      );

      showToast(
        "success",
        "Banner deleted successfully"
      );

      setDeleteTarget(null);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message ||
          "Failed to delete banner"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================================
  // TABLE ROWS
  // ==========================================================

  const rows = useMemo(
    () =>
      banners.map((b, index) => (
        <tr key={b._id}>
          <td>{index + 1}</td>

          <td>
            <img
              className="banner-thumb"
              src={getBannerImageUrl(b.imageURL)}
              alt={b.bannerType}
            />
          </td>

          <td>
            <span
              className={`banner-type-badge banner-type-badge--${b.bannerType}`}
            >
              {b.bannerType}
            </span>
          </td>

          <td>
            {formatDate(b.createdAt)}
          </td>

          <td>
            <div className="banner-actions">
              <button
                type="button"
                className="link-btn link-btn--edit"
                onClick={() =>
                  openEditModal(b)
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="link-btn link-btn--delete"
                onClick={() =>
                  setDeleteTarget(b)
                }
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      )),
    [banners]
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <div className="banner-page">

      {/* HEADER */}
      <div className="banner-page__header">
        <h1 className="banner-page__title">
          Banners
        </h1>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddModal}
        >
          + Add Banner
        </button>
      </div>

      {/* TABLE */}
      <div className="banner-table-card">

        {loading ? (
          <div className="banner-loading">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="banner-empty">
            No banners yet. Click "+ Add Banner"
            to create one.
          </div>
        ) : (
          <table className="banner-table">

            <thead>
              <tr>
                <th>S.NO</th>
                <th>IMAGE</th>
                <th>BANNER TYPE</th>
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
        <BannerFormModal
          banner={editingBanner}
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
          className="banner-modal-overlay"
          onClick={() =>
            !deleting &&
            setDeleteTarget(null)
          }
        >
          <div
            className="banner-modal confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="confirm-modal__icon">
              !
            </div>

            <h2 className="banner-modal__title">
              Delete banner?
            </h2>

            <p className="confirm-modal__text">
              This will permanently remove the{" "}
              {deleteTarget.bannerType} banner.
              This action cannot be undone.
            </p>

            <div className="modal-actions">

              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`banner-toast banner-toast--${toast.type}`}
        >
          {toast.message}
        </div>
      )}

    </div>
  );
};

// ==========================================================
// ADD / EDIT BANNER MODAL
// ==========================================================

const BannerFormModal = ({
  banner,
  onClose,
  onSaved,
  onError,
}) => {
  const isEdit = Boolean(banner);

  const [bannerType, setBannerType] = useState(
    banner?.bannerType || BANNER_TYPES[0]
  );

  const [imageFile, setImageFile] =
    useState(null);

  const [preview, setPreview] = useState(
    banner
      ? getBannerImageUrl(banner.imageURL)
      : ""
  );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================================
  // FILE CHANGE
  // ==========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!isEdit && !imageFile) {
      setError(
        "Banner image is required"
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "bannerType",
        bannerType
      );

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      if (isEdit) {
        const res = await updateBanner(
          banner._id,
          formData
        );

        onSaved(
          res.data.data,
          "update"
        );
      } else {
        const res =
          await createBanner(formData);

        onSaved(
          res.data.data,
          "create"
        );
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

  // ==========================================================
  // RETURN MODAL
  // ==========================================================

  return (
    <div
      className="banner-modal-overlay"
      onClick={() =>
        !saving && onClose()
      }
    >
      <div
        className="banner-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <h2 className="banner-modal__title">
          {isEdit
            ? "Edit Banner"
            : "Add Banner"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* BANNER TYPE */}
          <div className="form-group">

            <label className="form-label">
              Banner Type
            </label>

            <select
              className="form-select"
              value={bannerType}
              onChange={(e) =>
                setBannerType(
                  e.target.value
                )
              }
            >
              {BANNER_TYPES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>

          </div>

          {/* IMAGE */}
          <div className="form-group">

            <label className="form-label">
              Banner Image{" "}
              {isEdit && "(optional)"}
            </label>

            <input
              className="form-file"
              type="file"
              accept="image/*"
              onChange={
                handleFileChange
              }
            />

            {preview && (
              <img
                className="image-preview"
                src={preview}
                alt="Banner Preview"
              />
            )}

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
                : "Add Banner"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default BannerList;

