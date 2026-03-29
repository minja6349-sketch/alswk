import { Link } from 'react-router-dom';
import { Layout, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../App';

export default function Footer() {
  const { settings } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Layout className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                {settings?.siteName || '상상점포'}
              </span>
            </Link>
            <p className="text-gray-400 max-w-md mb-6">
              {settings?.siteDescription || '로고 디자인 및 홈페이지 제작 전문 업체입니다. 당신의 비즈니스를 위한 최상의 디자인 솔루션을 제공합니다.'}
            </p>
            <div className="flex space-x-4">
              <a href={settings?.socialLinks.instagram || '#'} className="text-gray-400 hover:text-purple-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings?.socialLinks.facebook || '#'} className="text-gray-400 hover:text-purple-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={settings?.socialLinks.twitter || '#'} className="text-gray-400 hover:text-purple-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">링크</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-purple-500 transition-colors">홈</Link></li>
              <li><Link to="/portfolio" className="text-gray-400 hover:text-purple-500 transition-colors">포트폴리오</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-purple-500 transition-colors">블로그</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">뉴스레터 구독</h3>
            <p className="text-gray-400 text-sm mb-4">최신 디자인 트렌드와 소식을 받아보세요.</p>
            <form 
              action="https://formspree.io/f/mlgojggp" 
              method="POST"
              className="flex flex-col space-y-2"
            >
              <input 
                type="email" 
                name="email"
                placeholder="이메일 주소" 
                required
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors"
              />
              <button 
                type="submit"
                className="bg-purple-600 text-white text-sm font-bold py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                구독하기
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} {settings?.siteName || '상상점포'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
