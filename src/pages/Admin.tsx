import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Settings, FileText, Briefcase, LayoutDashboard, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect } from 'react';

// Admin Components
import SettingsForm from '../components/admin/SettingsForm';
import PostManager from '../components/admin/PostManager';
import PortfolioManager from '../components/admin/PortfolioManager';
import InquiryManager from '../components/admin/InquiryManager';

export default function Admin() {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarLinks = [
    { name: '대시보드', path: '/admin', icon: LayoutDashboard },
    { name: '사이트 설정', path: '/admin/settings', icon: Settings },
    { name: '게시글 관리', path: '/admin/posts', icon: FileText },
    { name: '포트폴리오 관리', path: '/admin/portfolio', icon: Briefcase },
    { name: '문의사항 관리', path: '/admin/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl mb-6">
              <h2 className="text-lg font-bold text-white mb-1">관리자 모드</h2>
              <p className="text-xs text-gray-400">상상점포 웹사이트 관리</p>
            </div>
            
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all group",
                  currentPath === link.path 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                )}
              >
                <div className="flex items-center space-x-3">
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  currentPath === link.path ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )} />
              </Link>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[600px]">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/settings" element={<SettingsForm />} />
              <Route path="/posts" element={<PostManager />} />
              <Route path="/portfolio" element={<PortfolioManager />} />
              <Route path="/inquiries" element={<InquiryManager />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState({ posts: 0, portfolio: 0, inquiries: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const postsSnap = await getDocs(collection(db, 'posts'));
      const portfolioSnap = await getDocs(collection(db, 'portfolio'));
      const inquiriesSnap = await getDocs(collection(db, 'inquiries'));
      setStats({
        posts: postsSnap.size,
        portfolio: portfolioSnap.size,
        inquiries: inquiriesSnap.size
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">대시보드 개요</h1>
        <p className="text-gray-400">웹사이트의 현재 상태를 한눈에 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: '전체 게시글', value: stats.posts, icon: FileText, color: 'text-blue-400' },
          { label: '포트폴리오', value: stats.portfolio, icon: Briefcase, color: 'text-green-400' },
          { label: '새 문의사항', value: stats.inquiries, icon: MessageSquare, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-6 h-6", stat.color)} />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stats</span>
            </div>
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-8 bg-purple-600/10 border border-purple-500/20 rounded-3xl">
        <h3 className="text-xl font-bold text-purple-400 mb-4">빠른 시작 가이드</h3>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <p><strong>사이트 설정</strong>에서 로고, 색상, 히어로 텍스트를 수정하여 브랜드 아이덴티티를 설정하세요.</p>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <p><strong>포트폴리오 관리</strong>에 최근 작업물을 업로드하여 실력을 뽐내세요.</p>
          </li>
          <li className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
            <p><strong>게시글 관리</strong>를 통해 블로그 포스트나 공지사항을 작성하여 고객과 소통하세요.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
