import { createBrowserRouter } from "react-router";
import RootLayout from "./RootLayout";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminCategories from "./pages/admin/AdminCategories";
import BannersPage from "./pages/admin/BannersPage";
import AdminGuidelines from "./pages/admin/AdminGuidelines";
import AdminLoginPage from "./pages/AdminLoginPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SSOCallbackPage from "./pages/SSOCallbackPage";
import NotFoundPage from "./pages/NotFoundPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ShippingInfoPage from "./pages/ShippingInfoPage";
import ReturnsPage from "./pages/ReturnsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SitemapPage from "./pages/SitemapPage";
import CookieSettingsPage from "./pages/CookieSettingsPage";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: HomePage },
          { path: "shop", Component: ShopPage },
          { path: "shop/:category", Component: ShopPage },
          { path: "shop/:category/:subCategory", Component: ShopPage },
          { path: "product/:id", Component: ProductDetailPage },
          { path: "wishlist", Component: WishlistPage },
          { path: "cart", Component: CartPage },
          { path: "checkout", Component: CheckoutPage },
          { path: "order-confirmation/:orderId", Component: OrderConfirmationPage },
          { path: "orders", Component: MyOrdersPage },
          { path: "order/:orderId", Component: OrderDetailPage },
          { path: ":username/profile", Component: ProfilePage },
          { path: "profile", Component: ProfilePage },
          { path: "sign-in", Component: SignInPage },
          { path: "sign-up", Component: SignUpPage },
          { path: "sign-in/sso-callback", Component: SSOCallbackPage },
          { path: "sign-up/sso-callback", Component: SSOCallbackPage },
          { path: "faq", Component: FAQPage },
          { path: "contact", Component: ContactPage },
          { path: "about", Component: AboutPage },
          { path: "shipping", Component: ShippingInfoPage },
          { path: "returns", Component: ReturnsPage },
          { path: "terms", Component: TermsPage },
          { path: "privacy", Component: PrivacyPage },
          { path: "sitemap", Component: SitemapPage },
          { path: "cookies", Component: CookieSettingsPage },
          { path: "admin/login", Component: AdminLoginPage },
          {
            path: "admin",
            Component: (props) => (
              <ProtectedAdminRoute>
                <AdminDashboard {...props} />
              </ProtectedAdminRoute>
            ),
            children: [
              { index: true, Component: AdminOrders },
              { path: "orders", Component: AdminOrders },
              { path: "products", Component: AdminProducts },
              { path: "categories", Component: AdminCategories },
              { path: "coupons", Component: AdminCoupons },
              { path: "banners", Component: BannersPage },
              { path: "guidelines", Component: AdminGuidelines }
            ]
          },
          { path: "*", Component: NotFoundPage },
        ]
      }
    ]
  }
]);