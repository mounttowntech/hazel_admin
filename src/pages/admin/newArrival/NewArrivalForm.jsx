import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  createNewArrival,
  getNewArrivalById,
  updateNewArrival,
  getNewArrivalImageUrl,
} from "../../../services/newArrivalService";

import "./NewArrivalForm.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5004/api";

const NewArrivalForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  // ==========================================================
  // STATE
  // ==========================================================

  const [title, setTitle] =
    useState("");

  const [subtitle, setSubtitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [featuredProduct, setFeaturedProduct] =
    useState("");

  const [products, setProducts] =
    useState([]);

  const [allProducts, setAllProducts] =
    useState([]);

  const [imageFiles, setImageFiles] =
    useState([]);

  const [previewImages, setPreviewImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(isEditMode);

  const [error, setError] =
    useState("");

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  const fetchProducts = useCallback(async () => {
    try {
      const response =
        await axios.get(
          `${API_BASE_URL}/products/all`
        );

      setAllProducts(
        response?.data?.data ||
          response?.data ||
          []
      );
    } catch (err) {
      console.error(
        "FETCH PRODUCTS ERROR:",
        err
      );
    }
  }, []);

  // ==========================================================
  // FETCH EXISTING NEW ARRIVAL
  // ==========================================================

  const fetchNewArrival = useCallback(async () => {
    try {
      const response =
        await getNewArrivalById(id);

      const data = response?.data;

      if (!data) {
        throw new Error(
          "New Arrival not found"
        );
      }

      setTitle(data.title || "");

      setSubtitle(
        data.subtitle || ""
      );

      setDescription(
        data.description || ""
      );

      setFeaturedProduct(
        data.featuredProduct?._id ||
          data.featuredProduct ||
          ""
      );

      const existingProducts =
        (data.products || []).map(
          (item, index) => ({
            product:
              item.product?._id ||
              item.product ||
              "",
            displayOrder:
              item.displayOrder ||
              index + 1,
            isFeatured:
              item.isFeatured || false,
            oldImage:
              item.image || null,
          })
        );

      setProducts(
        existingProducts
      );

      setPreviewImages(
        existingProducts.map(
          (item) =>
            item.oldImage
              ? getNewArrivalImageUrl(
                  item.oldImage
                )
              : null
        )
      );
    } catch (err) {
      console.error(
        "FETCH NEW ARRIVAL ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load New Arrival"
      );
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    // Both fetchers are async and only call their setters after an
    // `await`, so nothing is set synchronously during this effect.
    // This is the standard data-fetch-on-mount pattern; the rule can't
    // trace through the async boundary, so it's suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();

    if (isEditMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchNewArrival();
    }
  }, [fetchProducts, fetchNewArrival, isEditMode]);

  // ==========================================================
  // ADD PRODUCT
  // ==========================================================

  const addProduct = () => {
    if (products.length >= 4) {
      setError(
        "Maximum 4 products are allowed."
      );
      return;
    }

    setError("");

    setProducts((prev) => [
      ...prev,
      {
        product: "",
        displayOrder:
          prev.length + 1,
        isFeatured: false,
        oldImage: null,
      },
    ]);

    setPreviewImages((prev) => [
      ...prev,
      null,
    ]);
  };

  // ==========================================================
  // REMOVE PRODUCT
  // ==========================================================

  const removeProduct = (index) => {
    setProducts((prev) => {
      const updated = prev.filter(
        (_, i) => i !== index
      );

      return updated.map(
        (item, i) => ({
          ...item,
          displayOrder:
            i + 1,
        })
      );
    });

    setImageFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );

    setPreviewImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ==========================================================
  // CHANGE PRODUCT
  // ==========================================================

  const handleProductChange = (
    index,
    value
  ) => {
    setProducts((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        product: value,
      };

      return updated;
    });
  };

  // ==========================================================
  // CHANGE ORDER
  // ==========================================================

  const handleOrderChange = (
    index,
    value
  ) => {
    setProducts((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        displayOrder:
          Number(value) || 1,
      };

      return updated;
    });
  };

  // ==========================================================
  // FEATURED PRODUCT TOGGLE
  // ==========================================================

  const handleFeaturedChange = (
    index
  ) => {
    setProducts((prev) =>
      prev.map((item, i) => ({
        ...item,
        isFeatured:
          i === index
            ? !item.isFeatured
            : false,
      }))
    );
  };

  // ==========================================================
  // IMAGE CHANGE
  // ==========================================================

  const handleImageChange = (
    index,
    file
  ) => {
    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select a valid image."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be less than 5MB."
      );
      return;
    }

    setError("");

    setImageFiles((prev) => {
      const updated = [...prev];

      updated[index] = file;

      return updated;
    });

    setPreviewImages((prev) => {
      const updated = [...prev];

      if (updated[index]) {
        URL.revokeObjectURL(
          updated[index]
        );
      }

      updated[index] =
        URL.createObjectURL(file);

      return updated;
    });
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    if (!title.trim()) {
      return "Title is required.";
    }

    if (
      products.length === 0
    ) {
      return (
        "Please add at least one product."
      );
    }

    const selectedProducts =
      products.map(
        (item) => item.product
      );

    if (
      selectedProducts.some(
        (item) => !item
      )
    ) {
      return (
        "Please select a product for every product slot."
      );
    }

    const uniqueProducts =
      new Set(selectedProducts);

    if (
      uniqueProducts.size !==
      selectedProducts.length
    ) {
      return (
        "Duplicate products are not allowed."
      );
    }

    if (
      featuredProduct &&
      !selectedProducts.includes(
        featuredProduct
      )
    ) {
      return (
        "Featured product must be one of the selected products."
      );
    }

    return null;
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "subtitle",
        subtitle.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      if (featuredProduct) {
        formData.append(
          "featuredProduct",
          featuredProduct
        );
      }

      const productData =
        products.map(
          (item, index) => ({
            product:
              item.product,
            displayOrder:
              Number(
                item.displayOrder
              ) || index + 1,
            isFeatured:
              item.isFeatured === true,
          })
        );

      formData.append(
        "products",
        JSON.stringify(productData)
      );

      /*
       * IMPORTANT:
       * Images must be appended in the
       * same order as products.
       */

      imageFiles.forEach((file) => {
        if (file) {
          formData.append(
            "productImages",
            file
          );
        }
      });

      if (isEditMode) {
        await updateNewArrival(
          id,
          formData
        );
      } else {
        await createNewArrival(
          formData
        );
      }

      navigate(
        "/admin/new-arrivals"
      );
    } catch (err) {
      console.error(
        "SAVE NEW ARRIVAL ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to save New Arrival."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (pageLoading) {
    return (
      <div className="new-arrival-form-loading">
        <div className="new-arrival-spinner"></div>
        <p>
          Loading New Arrival...
        </p>
      </div>
    );
  }

  // ==========================================================
  // FORM
  // ==========================================================

  return (
    <div className="new-arrival-form-page">

      {/* HEADER */}

      <div className="form-page-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              "/admin/new-arrivals"
            )
          }
        >
          ← Back
        </button>

        <div>
          <span className="form-eyebrow">
            PRODUCT MANAGEMENT
          </span>

          <h1>
            {isEditMode
              ? "Edit New Arrival"
              : "Create New Arrival"}
          </h1>

          <p>
            Add up to four products to
            your New Arrivals section.
          </p>
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="form-error">
          <span>⚠</span>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="new-arrival-form"
      >

        {/* BASIC INFORMATION */}

        <section className="form-section">

          <div className="section-heading">
            <div className="section-number">
              01
            </div>

            <div>
              <h2>
                Basic Information
              </h2>

              <p>
                Enter the title and
                description for this
                collection.
              </p>
            </div>
          </div>

          <div className="form-fields">

            <div className="form-group">
              <label>
                Title
                <span>*</span>
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="e.g. Fresh Arrivals"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>
                Subtitle
              </label>

              <input
                type="text"
                value={subtitle}
                onChange={(e) =>
                  setSubtitle(
                    e.target.value
                  )
                }
                placeholder="e.g. Discover what's new"
                maxLength={150}
              />
            </div>

            <div className="form-group full-width">
              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Write a short description..."
                rows="4"
                maxLength={500}
              />
            </div>

          </div>

        </section>

        {/* PRODUCTS */}

        <section className="form-section">

          <div className="section-heading section-heading-products">

            <div className="section-number">
              02
            </div>

            <div>
              <h2>
                New Arrival Products
              </h2>

              <p>
                Select up to 4 products
                and upload an image for
                each product.
              </p>
            </div>

            <div className="product-limit">
              {products.length}/4
            </div>

          </div>

          <div className="product-form-list">

            {products.map(
              (item, index) => (
                <div
                  className="product-form-card"
                  key={index}
                >

                  {/* NUMBER */}

                  <div className="product-index">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>

                  {/* IMAGE */}

                  <div className="form-image-upload">

                    <input
                      id={`image-${index}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) =>
                        handleImageChange(
                          index,
                          e.target
                            .files?.[0]
                        )
                      }
                    />

                    <label
                      htmlFor={`image-${index}`}
                      className="image-upload-box"
                    >

                      {previewImages[
                        index
                      ] ? (
                        <img
                          src={
                            previewImages[
                              index
                            ]
                          }
                          alt="Preview"
                        />
                      ) : (
                        <>
                          <span className="upload-icon">
                            ↑
                          </span>

                          <span>
                            Upload
                          </span>

                          <small>
                            JPG / PNG / WEBP
                          </small>
                        </>
                      )}

                    </label>

                  </div>

                  {/* DETAILS */}

                  <div className="product-form-details">

                    <div className="form-group">
                      <label>
                        Product
                        <span>*</span>
                      </label>

                      <select
                        value={
                          item.product
                        }
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select Product
                        </option>

                        {allProducts.map(
                          (product) => (
                            <option
                              key={
                                product._id
                              }
                              value={
                                product._id
                              }
                            >
                              {product.productName ||
                                product.name ||
                                product.title ||
                                "Unnamed Product"}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="small-fields">

                      <div className="form-group">
                        <label>
                          Display Order
                        </label>

                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={
                            item.displayOrder
                          }
                          onChange={(e) =>
                            handleOrderChange(
                              index,
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <label className="featured-checkbox">

                        <input
                          type="checkbox"
                          checked={
                            item.isFeatured
                          }
                          onChange={() =>
                            handleFeaturedChange(
                              index
                            )
                          }
                        />

                        <span className="custom-check"></span>

                        <span>
                          Featured
                        </span>

                      </label>

                    </div>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-product-btn"
                    onClick={() =>
                      removeProduct(
                        index
                      )
                    }
                  >
                    ×
                  </button>

                </div>
              )
            )}

          </div>

          {products.length < 4 && (
            <button
              type="button"
              className="add-product-btn"
              onClick={addProduct}
            >
              <span>+</span>
              Add Product
            </button>
          )}

        </section>

        {/* FEATURED PRODUCT */}

        <section className="form-section">

          <div className="section-heading">

            <div className="section-number">
              03
            </div>

            <div>
              <h2>
                Featured Product
              </h2>

              <p>
                Choose the main product
                for this New Arrival.
              </p>
            </div>

          </div>

          <div className="featured-select-wrapper">

            <label>
              Featured Product
            </label>

            <select
              value={featuredProduct}
              onChange={(e) =>
                setFeaturedProduct(
                  e.target.value
                )
              }
            >
              <option value="">
                No Featured Product
              </option>

              {products.map(
                (item, index) => {

                  const product =
                    allProducts.find(
                      (p) =>
                        p._id ===
                        item.product
                    );

                  if (!product) {
                    return null;
                  }

                  return (
                    <option
                      key={
                        item.product
                      }
                      value={
                        item.product
                      }
                    >
                      {product.productName ||
                        product.name ||
                        product.title ||
                        `Product ${
                          index + 1
                        }`}
                    </option>
                  );
                }
              )}

            </select>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-form-btn"
            onClick={() =>
              navigate(
                "/admin/new-arrivals"
              )
            }
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-form-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                {isEditMode
                  ? "Update New Arrival"
                  : "Create New Arrival"}
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
};

export default NewArrivalForm;