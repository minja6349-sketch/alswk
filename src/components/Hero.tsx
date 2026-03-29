import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Palette, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

export default function Hero() {
  const { settings } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black py-20">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-200 uppercase tracking-widest">Premium Design Studio</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-none">
            {settings?.heroTitle || '상상을 현실로 만드는\n디자인 솔루션'}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {settings?.heroSubtitle || '당신의 브랜드에 생명력을 불어넣는 로고와 웹사이트를 제작합니다. 감각적인 디자인으로 비즈니스의 가치를 높이세요.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/portfolio"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600"
            >
              포트폴리오 보기
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`mailto:${settings?.contactEmail || 'contact@sangsang.com'}`}
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 border border-white/20 rounded-full hover:bg-white/5"
            >
              문의하기
            </a>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Palette, title: '로고 디자인', desc: '브랜드의 정체성을 담은 유니크한 로고' },
            { icon: Globe, title: '웹사이트 제작', desc: '반응형 고성능 웹사이트 솔루션' },
            { icon: Sparkles, title: '브랜딩 전략', desc: '시각적 일관성을 통한 브랜드 가치 제고' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i + 0.4 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-purple-500/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <feature.icon className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
