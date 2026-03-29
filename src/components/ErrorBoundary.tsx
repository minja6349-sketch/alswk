import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      
      try {
        // Check if it's a Firestore JSON error
        if (this.state.error?.message.startsWith('{')) {
          const errData = JSON.parse(this.state.error.message);
          if (errData.error.includes('Missing or insufficient permissions')) {
            errorMessage = "접근 권한이 없습니다. 관리자 계정으로 로그인해주세요.";
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center">
            <h2 className="text-2xl font-black text-white mb-4">문제가 발생했습니다</h2>
            <p className="text-gray-400 mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
