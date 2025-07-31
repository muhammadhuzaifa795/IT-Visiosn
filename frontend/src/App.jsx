import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UploadPost from "./pages/UploadPost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import AIPromptPage from "./pages/AIPromptPage.jsx";
import CVList from "./pages/CVList.jsx";
import CVForm from "./pages/CVForm.jsx";
import CVPreview from "./components/CVPreview.jsx";
import Friends from "./pages/Friends.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import PasswordResetPage from "./pages/PasswordResetPage.jsx";
import AddFacePage from "./pages/AddFacePage.jsx";
import RoadmapPage from "./pages/RoadeMapPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import Help from "./pages/Help.jsx";
// import Settings from "./pages/Settings.jsx";

// New Interview Pages
import InterviewSetupPage from "./pages/InterviewSetupPage.jsx";
import LiveInterview from "./pages/LiveInterview.jsx";
import InterviewResultPage from "./pages/InterviewResultPage.jsx";
import InterviewDashboardPage from "./pages/InterviewDashboardPage.jsx";
import Jarvis from "./components/Jarvis.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import { Settings } from "lucide-react";
import Settingspage from "./pages/Settingspage.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/posts/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <PostDetail />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/landing"
          element={!isAuthenticated ? <LandingPage /> : <Navigate to={"/"} />}
        />
        <Route path="/add-face" element={<AddFacePage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <ProfilePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/create-post"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <UploadPost />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Friends />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <UserPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/ai-prompt"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <AIPromptPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/roadmap"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <RoadmapPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chatbot"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <ChatbotPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chatbot/:chatId"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <ChatbotPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />


         <Route
          path="/help"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Help />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
            <Route
          path="/settingspage"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Settingspage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />



        {/* Interview Routes */}
        <Route
          path="/interviews"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <InterviewDashboardPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
           <Route
          path="/leaderboard"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <Leaderboard />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/create-interview"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <InterviewSetupPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/interview/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <LiveInterview />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/result/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <InterviewResultPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/cv-list"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <CVList />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/cv-form"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <CVForm />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/cv/preview/:userId"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <CVPreview />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
      <Toaster />
      <Jarvis />
    </div>
  );
};

export default App;
