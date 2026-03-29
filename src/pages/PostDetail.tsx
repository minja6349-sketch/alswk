import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'posts', id));
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('링크가 클립보드에 복사되었습니다.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다.</h1>
        <Link to="/blog" className="text-purple-500 hover:underline">블로그로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" />
          <span>목록으로 돌아가기</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 text-xs font-bold text-purple-500 uppercase tracking-widest mb-6">
            <span>{post.category || '디자인'}</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '2024.03.29'}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-12 leading-tight tracking-tighter">
            {post.title}
          </h1>

          {post.thumbnail && (
            <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-16 border border-white/10">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="prose prose-invert prose-purple max-w-none">
            <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-bold">{post.author || '상상점포'}</p>
                <p className="text-gray-500 text-sm">Design Studio Manager</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>공유하기</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
