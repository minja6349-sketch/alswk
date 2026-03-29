import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';
import { Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  message: z.string().min(5, '문의 내용을 5자 이상 입력해주세요'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Save to Firestore (Internal Admin Panel)
      await addDoc(collection(db, 'inquiries'), {
        ...data,
        createdAt: serverTimestamp(),
      });

      // 2. Submit to Formspree (External Collection/Email)
      const response = await fetch('https://formspree.io/f/mlgojggp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      toast.error('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-purple-600/10 border border-purple-500/30 rounded-[2.5rem] p-12 text-center"
          >
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">문의가 접수되었습니다!</h3>
            <p className="text-gray-400 text-lg">
              상상점포 전문가가 확인 후 빠른 시일 내에 연락드리겠습니다.<br />
              감사합니다.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-black text-white mb-4">프로젝트 문의하기</h2>
              <p className="text-gray-400">당신의 아이디어를 들려주세요. 상상점포가 현실로 만들어 드립니다.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">이름</label>
                  <input
                    {...register('name')}
                    placeholder="성함을 입력해주세요"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                  />
                  {errors.name && <p className="text-red-500 text-xs ml-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">이메일</label>
                  <input
                    {...register('email')}
                    placeholder="example@email.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                  />
                  {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">핸드폰 번호</label>
                <input
                  {...register('phone')}
                  placeholder="010-0000-0000"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600"
                />
                {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1">문의 내용</label>
                <textarea
                  {...register('message')}
                  placeholder="제작하고 싶은 로고나 홈페이지에 대해 자유롭게 설명해주세요."
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-purple-500 outline-none transition-all placeholder:text-gray-600 resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative flex items-center justify-center space-x-2 bg-purple-600 text-white font-black py-5 rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {isSubmitting ? '전송 중...' : '문의 보내기'}
                  {!isSubmitting && <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
