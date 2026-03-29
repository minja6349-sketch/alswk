import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'), 
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase">Insights</h1>
          <p className="text-xl text-gray-400">디자인 트렌드, 브랜딩 인사이트, 그리고 상상점포의 최신 소식을 전해드립니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-8 bg-white/5">
                  <img
                    src={post.thumbnail || `https://picsum.photos/seed/${post.id}/800/500`}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="text-purple-500">{post.category || '디자인'}</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '2024.03.29'}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-2 leading-relaxed">
                    {post.excerpt || '게시글의 요약 내용이 여기에 표시됩니다. 독자의 관심을 끌 수 있는 매력적인 문구를 작성해보세요.'}
                  </p>
                  <div className="pt-4 flex items-center text-sm font-bold text-white group-hover:text-purple-500 transition-colors">
                    자세히 보기 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-600 text-lg">아직 등록된 게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
