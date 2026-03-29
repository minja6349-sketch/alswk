import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth, SiteSettings } from '../../App';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const settingsSchema = z.object({
  siteName: z.string().min(1, '사이트 이름을 입력하세요'),
  siteDescription: z.string().min(1, '사이트 설명을 입력하세요'),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '올바른 Hex 색상 코드를 입력하세요'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '올바른 Hex 색상 코드를 입력하세요'),
  fontFamily: z.string(),
  logoUrl: z.string().url('올바른 URL을 입력하세요').or(z.literal('')).optional(),
  heroTitle: z.string().min(1, '히어로 제목을 입력하세요'),
  heroSubtitle: z.string().min(1, '히어로 부제목을 입력하세요'),
  contactEmail: z.string().email('올바른 이메일을 입력하세요'),
  socialLinks: z.object({
    instagram: z.string().url('올바른 URL을 입력하세요').or(z.literal('')).optional(),
    facebook: z.string().url('올바른 URL을 입력하세요').or(z.literal('')).optional(),
    twitter: z.string().url('올바른 URL을 입력하세요').or(z.literal('')).optional(),
  }),
});

export default function SettingsForm() {
  const { settings } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SiteSettings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings || undefined,
  });

  const onSubmit = async (data: SiteSettings) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), data);
      toast.success('사이트 설정이 저장되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">사이트 설정</h1>
        <p className="text-gray-400">웹사이트의 전반적인 디자인과 정보를 커스터마이징하세요.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">사이트 이름</label>
            <input
              {...register('siteName')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="상상점포"
            />
            {errors.siteName && <p className="text-red-500 text-xs">{errors.siteName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">문의 이메일</label>
            <input
              {...register('contactEmail')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="contact@example.com"
            />
            {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-300">사이트 설명 (SEO)</label>
          <textarea
            {...register('siteDescription')}
            rows={3}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors resize-none"
            placeholder="로고 디자인 및 홈페이지 제작 전문 업체..."
          />
          {errors.siteDescription && <p className="text-red-500 text-xs">{errors.siteDescription.message}</p>}
        </div>

        {/* Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">주요 포인트 컬러 (Hex)</label>
            <div className="flex space-x-2">
              <input
                {...register('primaryColor')}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                placeholder="#8B5CF6"
              />
              <div 
                className="w-12 h-12 rounded-xl border border-white/10" 
                style={{ backgroundColor: settings?.primaryColor || '#8B5CF6' }}
              />
            </div>
            {errors.primaryColor && <p className="text-red-500 text-xs">{errors.primaryColor.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">폰트 패밀리</label>
            <select
              {...register('fontFamily')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
            >
              <option value="Inter, sans-serif">Inter (기본)</option>
              <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
              <option value="'Pretendard', sans-serif">Pretendard</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">로고 URL</label>
            <input
              {...register('logoUrl')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">히어로 섹션 설정</h3>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">메인 제목</label>
            <input
              {...register('heroTitle')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">부제목</label>
            <textarea
              {...register('heroSubtitle')}
              rows={2}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Instagram</label>
            <input
              {...register('socialLinks.instagram')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Facebook</label>
            <input
              {...register('socialLinks.facebook')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Twitter</label>
            <input
              {...register('socialLinks.twitter')}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>설정 저장하기</span>
        </button>
      </form>
    </div>
  );
}
