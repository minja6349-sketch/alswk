import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  link: string;
  order: number;
}

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Partial<PortfolioItem>>();

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem)));
    });
    return unsubscribe;
  }, []);

  const onSubmit = async (data: Partial<PortfolioItem>) => {
    try {
      if (currentItem) {
        await updateDoc(doc(db, 'portfolio', currentItem.id), data);
        toast.success('포트폴리오가 수정되었습니다.');
      } else {
        await addDoc(collection(db, 'portfolio'), {
          ...data,
          order: items.length + 1,
        });
        toast.success('포트폴리오가 추가되었습니다.');
      }
      setIsEditing(false);
      setCurrentItem(null);
      reset();
    } catch (error) {
      console.error(error);
      toast.error('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setValue('title', item.title);
    setValue('description', item.description);
    setValue('imageUrl', item.imageUrl);
    setValue('category', item.category);
    setValue('link', item.link);
    setValue('order', item.order);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">포트폴리오 관리</h1>
          <p className="text-gray-400">제작된 로고 및 웹사이트 작업물을 관리하세요.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => { setIsEditing(true); reset(); setCurrentItem(null); }}
            className="flex items-center space-x-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>작업물 추가</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{currentItem ? '작업물 수정' : '새 작업물 추가'}</h2>
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
                <select {...register('category')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500">
                  <option value="로고 디자인">로고 디자인</option>
                  <option value="웹사이트 제작">웹사이트 제작</option>
                  <option value="브랜딩">브랜딩</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">대표 이미지 URL</label>
              <input {...register('imageUrl')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="https://picsum.photos/..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">상세 설명</label>
              <textarea {...register('description')} rows={3} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">관련 링크 (Optional)</label>
              <input {...register('link')} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="https://..." />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-black/40 border border-white/5 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all">
              <div className="aspect-video bg-white/5 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded mb-2 inline-block">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center space-x-2 bg-white/5 text-xs font-bold py-2 rounded-xl hover:bg-white/10 transition-colors">
                    <Edit2 className="w-3 h-3" />
                    <span>수정</span>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 flex items-center justify-center space-x-2 bg-red-500/10 text-red-500 text-xs font-bold py-2 rounded-xl hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 bg-black/40 border border-white/5 border-dashed rounded-3xl text-gray-500">
              추가된 작업물이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
