import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { initializeSampleData } from './lib/sampleData';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PortfolioPage from './pages/PortfolioPage';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';

// Types
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  settings: SiteSettings | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  settings: null,
});

export const useAuth = () => useContext(AuthContext);

const defaultSettings: SiteSettings = {
  siteName: "상상점포",
  siteDescription: "로고 디자인 및 홈페이지 제작 전문 업체",
  primaryColor: "#8B5CF6", // Purple-500
  secondaryColor: "#000000",
  fontFamily: "Inter, sans-serif",
  logoUrl: "",
  heroTitle: "상상을 현실로 만드는 디자인",
  heroSubtitle: "당신의 브랜드에 생명력을 불어넣는 로고와 웹사이트를 제작합니다.",
  contactEmail: "contact@sangsang.com",
  socialLinks: {
    instagram: "",
    facebook: "",
    twitter: "",
  },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin (default admin or from DB)
        const isAdminEmail = currentUser.email === "minja6349@gmail.com";
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: isAdminEmail ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
          });
        }
        
        setIsAdmin(isAdminEmail || userDoc.data()?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Listen to settings
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      } else {
        setSettings(defaultSettings);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-purple-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <AuthContext.Provider value={{ user, isAdmin, loading, settings }}>
        <Router>
          <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<PostDetail />} />
                <Route 
                  path="/admin/*" 
                  element={isAdmin ? <Admin /> : <Navigate to="/" />} 
                />
              </Routes>
            </div>
            <Footer />
            <Toaster position="top-right" theme="dark" richColors />
          </div>
        </Router>
      </AuthContext.Provider>
    </HelmetProvider>
  );
}
