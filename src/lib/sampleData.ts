import { collection, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function initializeSampleData() {
  const settingsSnap = await getDocs(collection(db, 'settings'));
  if (settingsSnap.empty) {
    await setDoc(doc(db, 'settings', 'global'), {
      siteName: "상상점포",
      siteDescription: "로고 디자인 및 홈페이지 제작 전문 업체 - 모던하고 고급스러운 디자인 솔루션",
      primaryColor: "#8B5CF6",
      secondaryColor: "#000000",
      fontFamily: "Inter, sans-serif",
      logoUrl: "",
      heroTitle: "상상을 현실로 만드는\n디자인 솔루션",
      heroSubtitle: "당신의 브랜드에 생명력을 불어넣는 로고와 웹사이트를 제작합니다. 감각적인 디자인으로 비즈니스의 가치를 높이세요.",
      contactEmail: "contact@sangsang.com",
      socialLinks: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
      },
    });
  }

  const portfolioSnap = await getDocs(collection(db, 'portfolio'));
  if (portfolioSnap.empty) {
    const samples = [
      {
        title: "모던 미니멀 로고 디자인",
        description: "IT 스타트업을 위한 깔끔하고 세련된 아이덴티티 구축 프로젝트입니다.",
        imageUrl: "https://picsum.photos/seed/logo1/800/600",
        category: "로고 디자인",
        order: 1,
      },
      {
        title: "프리미엄 패션 브랜드 웹사이트",
        description: "고급스러운 분위기와 사용자 경험을 극대화한 이커머스 솔루션입니다.",
        imageUrl: "https://picsum.photos/seed/web1/800/600",
        category: "웹사이트 제작",
        order: 2,
      },
      {
        title: "친환경 코스메틱 브랜딩",
        description: "자연 친화적인 이미지를 강조한 패키지 및 로고 통합 브랜딩입니다.",
        imageUrl: "https://picsum.photos/seed/brand1/800/600",
        category: "브랜딩",
        order: 3,
      }
    ];
    for (const sample of samples) {
      await addDoc(collection(db, 'portfolio'), sample);
    }
  }

  const postsSnap = await getDocs(collection(db, 'posts'));
  if (postsSnap.empty) {
    const samples = [
      {
        title: "2024년 디자인 트렌드 리포트",
        content: "올해의 디자인 트렌드는 미니멀리즘과 대담한 타이포그래피의 조화입니다...\n\n디자인은 끊임없이 변화합니다. 상상점포는 이러한 변화의 흐름을 읽고 고객에게 최상의 가치를 전달합니다.",
        excerpt: "2024년 주목해야 할 디자인 트렌드 5가지를 소개합니다.",
        category: "디자인",
        published: true,
        createdAt: serverTimestamp(),
        author: "상상점포",
        thumbnail: "https://picsum.photos/seed/post1/800/500",
      },
      {
        title: "성공적인 로고 제작을 위한 팁",
        content: "좋은 로고는 단순해야 하며, 기억에 남아야 합니다. 브랜드의 핵심 가치를 시각적으로 표현하는 과정은 매우 중요합니다.",
        excerpt: "브랜드의 첫인상을 결정짓는 로고, 어떻게 만들어야 할까요?",
        category: "가이드",
        published: true,
        createdAt: serverTimestamp(),
        author: "상상점포",
        thumbnail: "https://picsum.photos/seed/post2/800/500",
      }
    ];
    for (const sample of samples) {
      await addDoc(collection(db, 'posts'), sample);
    }
  }
}
