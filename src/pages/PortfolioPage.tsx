import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('전체');
  const categories = ['전체', '로고 디자인', '웹사이트 제작', '브랜딩'];

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const filteredItems = filter === '전체' 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">PORTFOLIO</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">상상점포가 만들어낸 수많은 성공 사례들을 확인해보세요.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="flex items-center space-x-2 mr-4 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-widest">Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                filter === cat 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                      >
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-3 block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-32 text-gray-600">
            해당 카테고리의 작업물이 아직 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
