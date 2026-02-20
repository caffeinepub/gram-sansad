import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import LoginPrompt from './components/LoginPrompt';
import { useAnnouncementNotifications } from './hooks/useAnnouncementNotifications';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AppContent() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  useAnnouncementNotifications();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  console.log('[App] State:', {
    isAuthenticated,
    profileLoading,
    isFetched,
    hasProfile: !!userProfile,
    showProfileSetup,
  });

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      <RouterProvider router={router} />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ChatPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/announcements',
  component: AdminAnnouncementsPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const routeTree = rootRoute.addChildren([chatRoute, adminRoute, registerRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppContent />
      <Toaster />
    </ThemeProvider>
  );
}
