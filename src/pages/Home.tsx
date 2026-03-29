import Hero from '../components/Hero';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Home() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioSnap = await getDocs(query(collection(db, 'portfolio'), limit(3)));
        setPortfolio(portfolioSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const postsSnap = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3)));
        setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-black">
      <Hero />

      {/* Portfolio Section */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-white mb-4">최근 작업물</h2>
              <p className="text-gray-400">상상점포가 제작한 감각적인 디자인 결과물입니다.</p>
            </div>
            <Link to="/portfolio" className="text-purple-500 hover:text-purple-400 font-bold flex items-center">
              전체보기 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolio.length > 0 ? portfolio.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-6">{item.description}</p>
                  <Link to={`/portfolio`} className="inline-flex items-center text-white text-sm font-bold hover:text-purple-400">
                    자세히 보기 <ExternalLink className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse flex items-center justify-center text-gray-600">
                  작업물 준비 중
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">새로운 소식</h2>
            <p className="text-gray-400">디자인 트렌드와 상상점포의 소식을 만나보세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                  <img
                    src={post.thumbnail || `https://picsum.photos/seed/${post.id}/800/500`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 block">
                  {post.category || '디자인'}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {post.excerpt || '게시글 요약 내용이 여기에 표시됩니다.'}
                </p>
              </Link>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[16/10] bg-black/20 rounded-2xl animate-pulse" />
                  <div className="h-4 w-24 bg-black/20 rounded animate-pulse" />
                  <div className="h-6 w-full bg-black/20 rounded animate-pulse" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">GET IN TOUCH</h2>
            <p className="text-gray-400">새로운 프로젝트를 위한 첫 걸음, 지금 바로 문의하세요.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
            지금 바로 당신의 프로젝트를 시작하세요
          </h2>
          <p className="text-purple-100 text-lg mb-12 max-w-2xl mx-auto">
            상상점포의 전문가들이 당신의 아이디어를 최고의 결과물로 만들어 드립니다.
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center px-10 py-4 font-bold text-purple-600 bg-white rounded-full hover:bg-purple-50 transition-colors"
          >
            무료 상담 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}
