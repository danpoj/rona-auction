'use client';

import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

declare global {
  export interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const checkUnsupportedBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    (userAgent.indexOf('safari') > -1 &&
      userAgent.indexOf('chrome') <= -1 &&
      userAgent.indexOf('chromium') <= -1) ||
    (userAgent.indexOf('firefox') > -1 && userAgent.indexOf('seamonkey') <= -1)
  );
};

export const InstallPWAButton = () => {
  const [pwa, setPWA] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();

      setPWA(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (!pwa) return null;

  return (
    <Button
      onClick={() => {
        if (pwa) {
          pwa.prompt();

          pwa.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              setPWA(null);
            }
          });
        } else {
          toast('알림', {
            description:
              '모바일 | 데스크톱 앱이 이미 설치되었거나 지원하지않는 환경입니다.',
          });
        }
      }}
      size='sm'
      variant='ringHover'
      className='rounded-full h-6 text-xs'
    >
      데스크톱 앱 추가
      <Download className='size-3 ml-1' />
    </Button>
  );
};
