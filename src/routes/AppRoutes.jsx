import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import VerifyOTP from "../pages/auth/VerifyOTP";

import AdminLayout from "../components/admin/Layout/AdminLayout";

import Dashboard from "../pages/dashboard/Dashboard";
import CategoryList from "../pages/admin/catalog/categories/CategoryList";
import SubCategoryList from "../pages/admin/catalog/subCategory/SubCategoryList";
import BrandList from "../pages/admin/catalog/brands/BrandList";
import LengthList from "../pages/admin/catalog/product-length/LengthList";
// import NeckPatternList from "../pages/admin/catalog/neck-patterns/NeckPatternList";
import ProductList from "../pages/admin/catalog/products/ProductList";
import ProductVariantList from "../pages/admin/catalog/productVariant/ProductVariant";
import SizeList from "../pages/admin/catalog/size/SizeList";
import ColorList from "../pages/admin/catalog/color/Colorlist"
import BannerList from "../pages/admin/banner/BannerList";
import BannerProductList from "../pages/admin/bannerProduct/BannerProductList";
import NewArrivalList from "../pages/admin/newArrival/NewArrivalList";
import NewArrivalForm from "../pages/admin/newArrival/NewArrivalForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =================================
          AUTH ROUTES
      ================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* =================================
          ADMIN ROUTES
      ================================= */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/catalog/categories" element={<CategoryList />} />
        <Route path="/admin/catalog/subcategories" element={<SubCategoryList />} />
        <Route path="/admin/catalog/brands" element={<BrandList />} />
        <Route path="/admin/catalog/product-length" element={<LengthList />} />
        {/* <Route path="/admin/catalog/neck-patterns" element={<NeckPatternList />} /> */}
        <Route path="/admin/catalog/products" element={<ProductList />} />
        <Route path="/admin/catalog/product-variants" element={<ProductVariantList />} />
        <Route path="/admin/catalog/size" element={<SizeList />} />
        <Route path="/admin/catalog/colors" element={<ColorList />} />
        <Route path="/admin/promotions/banners" element={<BannerList/>}/>
       <Route
  path="/admin/promotions/banner-products"
  element={<BannerProductList />}
/>
<Route path="/admin/promotions/new-arrivals" element={<NewArrivalList/>}/>
<Route path="/admin/promotions/new-arrivals/create" element={<NewArrivalForm/>}/>
<Route path="/admin/promotions/new-arrivals/:id/edit" element={<NewArrivalForm/>}/>
      </Route>

      {/* =================================
          DEFAULT ROUTE
      ================================= */}
      {/* 
      <Route path="*" element={<Navigate to="/login" replace />} />
      */}
    </Routes>
  );
};

export default AppRoutes;