import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  published: boolean;
  createdAt: any;
}

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Partial<Post>>();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    });
    return unsubscribe;
  }, []);

  const onSubmit = async (data: Partial<Post>) => {
    try {
      if (currentPost) {
        await updateDoc(doc(db, 'posts', currentPost.id), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast.success('게시글이 수정되었습니다.');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...data,
          authorId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
          published: data.published ?? true,
        });
        toast.success('게시글이 작성되었습니다.');
      }
      setIsEditing(false);
      setCurrentPost(null);
      reset();
    } catch (error) {
      console.error(error);
      toast.error('게시글 저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setIsEditing(true);
    setValue('title', post.title);
    setValue('content', post.content);
    setValue('excerpt', post.excerpt);
    setValue('category', post.category);
    setValue('thumbnail', post.thumbnail);
    setValue('published', post.published);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      toast.success('게시글이 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      await updateDoc(doc(db, 'posts', post.id), { published: !post.published });
      toast.success(post.published ? '비공개 처리되었습니다.' : '공개 처리되었습니다.');
    } catch (error) {
      toast.error('상태 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">게시글 관리</h1>
          <p className="text-gray-400">블로그 포스트와 공지사항을 관리하세요.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => { setIsEditing(true); reset(); setCurrentPost(null); }}
            className="flex items-center space-x-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>새 글 작성</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{currentPost ? '게시글 수정' : '새 게시글 작성'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">제목</label>
                <input {...register('title')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">카테고리</label>
                <input {...register('category')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="디자인, 뉴스, 가이드 등" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">썸네일 이미지 URL</label>
              <input {...register('thumbnail')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="https://picsum.photos/..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">요약 (Excerpt)</label>
              <textarea {...register('excerpt')} rows={2} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">내용 (Markdown 지원 예정)</label>
              <textarea {...register('content')} rows={10} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none font-mono text-sm" />
            </div>

            <div className="flex items-center space-x-3">
              <input type="checkbox" {...register('published')} id="published" className="w-5 h-5 rounded border-white/10 bg-black/60 text-purple-600 focus:ring-purple-500" />
              <label htmlFor="published" className="text-sm font-bold text-gray-300">즉시 공개</label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all">
                저장하기
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-8 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all">
                취소
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-purple-500/30 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
                  {post.thumbnail && <img src={post.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">
                      {post.category || '일반'}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '방금 전'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">{post.title}</h3>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button onClick={() => togglePublish(post)} className="p-2 text-gray-400 hover:text-white transition-colors" title={post.published ? '비공개로 전환' : '공개로 전환'}>
                  {post.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(post)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20 bg-black/40 border border-white/5 border-dashed rounded-3xl text-gray-500">
              작성된 게시글이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
