import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import BuyMobile from "./pages/BuyMobile";
import MobileDetails from "./pages/MobileDetails";
import SellPhone from "./pages/SellPhone";
import WantedPhones from "./pages/WantedPhones";
import PostWantedRequest from "./pages/PostWantedRequest";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import EditListing from "./pages/EditListing";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import CompleteProfile from "./pages/CompleteProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Safety from "./pages/Safety";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mobiles" element={<BuyMobile />} />
        <Route path="/mobile/:id" element={<MobileDetails />} />
        <Route path="/category/:brand" element={<BuyMobile />} />
        <Route path="/wanted-phones" element={<WantedPhones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/sell" element={<SellPhone />} />
          <Route path="/sell-mobile" element={<SellPhone />} />
          <Route path="/wanted-phones/new" element={<PostWantedRequest />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/edit-listing/:id" element={<EditListing />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          {/*
            Deliberately not "/admin" — this slug can be changed to
            anything you like; the real protection is server-side.
          */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}