import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { MessageSquare, Megaphone, UserCircle, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SiX, SiFacebook, SiInstagram } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userRole === 'admin';

  const handleLogout = async () => {
    await clear();
    window.location.reload();
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">Community Chat</span>
      </Link>
      {isAdmin && (
        <Link
          to="/admin/announcements"
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Megaphone className="w-5 h-5" />
          <span className="font-medium">Announcements</span>
        </Link>
      )}
      <Link
        to="/register"
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
        onClick={() => setMobileMenuOpen(false)}
      >
        <UserCircle className="w-5 h-5" />
        <span className="font-medium">Registration</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Gram Sansad"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-primary">Gram Sansad</h1>
              <p className="text-xs text-muted-foreground">Community Portal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-3">
            {identity && userProfile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent rounded-full">
                <UserCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{userProfile.name}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {identity && userProfile && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg mb-4">
                      <UserCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{userProfile.name}</span>
                    </div>
                  )}
                  <NavLinks />
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2 justify-start"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Gram Sansad. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Empowering communities through digital connectivity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
