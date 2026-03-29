import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Mail, Phone, User, Calendar, Trash2, MessageSquare } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
}

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('이 문의를 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      toast.success('문의가 삭제되었습니다.');
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">문의사항 관리</h1>
        <p className="text-gray-400">고객들이 남긴 소중한 문의 메시지를 확인하세요.</p>
      </div>

      <div className="space-y-6">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-black/40 border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div className="flex items-center space-x-3 text-gray-300">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="font-bold">{inquiry.name}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <a href={`mailto:${inquiry.email}`} className="hover:text-purple-400 transition-colors">{inquiry.email}</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <a href={`tel:${inquiry.phone}`} className="hover:text-purple-400 transition-colors">{inquiry.phone}</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleString() : '방금 전'}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(inquiry.id)}
                className="self-start p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 transition-colors"
                title="문의 삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black/60 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center space-x-2 mb-4 text-purple-400">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Message</span>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>
        ))}

        {inquiries.length === 0 && (
          <div className="text-center py-24 bg-black/40 border border-white/5 border-dashed rounded-[2.5rem] text-gray-500">
            접수된 문의사항이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
