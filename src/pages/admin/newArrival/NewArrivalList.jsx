import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllNewArrivals,
  deleteNewArrival,
  getNewArrivalImageUrl,
} from "../../../services/newArrivalService";

import "./NewArrivalList.css";

const NewArrivalList = () => {
  const navigate = useNavigate();

  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ==========================================================
  // FETCH NEW ARRIVALS (used by the Retry button — an event
  // handler, so setState here is fine and NOT flagged by the
  // set-state-in-effect rule)
  // ==========================================================
  const fetchNewArrivals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllNewArrivals();
      setNewArrivals(response?.data || []);
    } catch (err) {
      console.error("FETCH NEW ARRIVALS ERROR:", err);
      setError(
        err?.response?.data?.message || "Failed to load New Arrivals"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // No setState call happens before the first `await` here, so
  // nothing runs synchronously inside the effect body itself —
  // this satisfies react-hooks/set-state-in-effect. `loading`
  // and `error` already start correctly (true / "") from
  // useState, so there's no need to reset them on mount.
  // ==========================================================
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const response = await getAllNewArrivals();
        if (ignore) return;
        setNewArrivals(response?.data || []);
      } catch (err) {
        if (ignore) return;
        console.error("FETCH NEW ARRIVALS ERROR:", err);
        setError(
          err?.response?.data?.message || "Failed to load New Arrivals"
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // ==========================================================
  // DELETE
  // ==========================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this New Arrival?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteNewArrival(id);
      setNewArrivals((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("DELETE NEW ARRIVAL ERROR:", err);
      alert(err?.response?.data?.message || "Failed to delete New Arrival");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================
  if (loading) {
    return (
      <div className="new-arrival-page">
        <div className="new-arrival-loading">
          <div className="new-arrival-spinner"></div>
          <p>Loading New Arrivals...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================
  return (
    <div className="new-arrival-page">
      {/* HEADER */}
      <div className="new-arrival-header">
        <div>
          <span className="page-eyebrow">PRODUCT MANAGEMENT</span>
          <h1>New Arrivals</h1>
          <p>Manage the products displayed in your New Arrivals section.</p>
        </div>
        <button
          className="new-arrival-add-btn"
          onClick={() => navigate("/admin/new-arrivals/create")}
        >
          <span>+</span>
          Add New Arrival
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="new-arrival-error">
          {error}
          <button onClick={fetchNewArrivals}>Retry</button>
        </div>
      )}

      {/* EMPTY */}
      {!error && newArrivals.length === 0 && (
        <div className="new-arrival-empty">
          <div className="empty-icon">✦</div>
          <h2>No New Arrivals Yet</h2>
          <p>Create your first New Arrival collection with up to four products.</p>
          <button onClick={() => navigate("/admin/new-arrivals/create")}>
            Create New Arrival
          </button>
        </div>
      )}

      {/* CARDS */}
      <div className="new-arrival-grid">
        {newArrivals.map((arrival) => (
          <div className="new-arrival-card" key={arrival._id}>
            {/* CARD TOP */}
            <div className="arrival-card-top">
              <div>
                <h2>{arrival.title}</h2>
                {arrival.subtitle && <p>{arrival.subtitle}</p>}
              </div>
              <div className="product-count">
                {arrival.products?.length || 0}/4
              </div>
            </div>

            {/* DESCRIPTION */}
            {arrival.description && (
              <p className="arrival-description">{arrival.description}</p>
            )}

            {/* PRODUCTS */}
            <div className="arrival-products">
              {arrival.products?.map((product, index) => {
                const imageUrl = getNewArrivalImageUrl(product.image);

                return (
                  <div
                    className="arrival-product"
                    key={product._id || index}
                  >
                    <div className="arrival-image">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.product?.name || "Product"}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      {product.isFeatured && (
                        <span className="featured-badge">Featured</span>
                      )}
                    </div>
                    <div className="arrival-product-info">
                      <span className="order-number">
                        #{product.displayOrder}
                      </span>
                      <h3>
                        {product.product?.productName ||
                          product.product?.name ||
                          "Product"}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CARD FOOTER */}
            <div className="arrival-card-footer">
              <div className="created-date">
                Created{" "}
                {arrival.createdAt
                  ? new Date(arrival.createdAt).toLocaleDateString()
                  : "-"}
              </div>
              <div className="arrival-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/admin/new-arrivals/edit/${arrival._id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  disabled={deleteLoading === arrival._id}
                  onClick={() => handleDelete(arrival._id)}
                >
                  {deleteLoading === arrival._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivalList;