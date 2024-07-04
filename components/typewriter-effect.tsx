'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(''),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          if (idx === 0)
            return (
              <Link
                href='https://maplestoryworlds.nexon.com/ko/play/c3f8ebc162a7443d814226dfb235cc99/'
                key={`word-${idx}`}
                target='_blank'
                rel='noreferrer noopener'
                className='inline-flex bg-gradient-to-r from-sky-500 to-violet-400 bg-clip-text text-transparent underline underline-offset-8 mr-2'
              >
                {word.text.map((char, index) => (
                  <span
                    key={`char-${index}`}
                    className={cn(`font-black`, word.className)}
                  >
                    {char}
                  </span>
                ))}
                &nbsp;
                <ArrowUpRight className='text-indigo-600' />
              </Link>
            );

          return (
            <div key={`word-${idx}`} className='inline-block'>
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`text-primary/90`, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('flex space-x-1 my-6', className)}>
      <motion.div
        className='overflow-hidden pb-2'
        initial={{
          width: '0%',
        }}
        whileInView={{
          width: 'fit-content',
        }}
        transition={{
          duration: 0.7,
          ease: 'linear',
          delay: 0.2,
        }}
      >
        <div
          className='text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold'
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {renderWords()}{' '}
        </div>{' '}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'block rounded-sm w-[3px] h-6 md:h-7 xl:h-8 bg-muted-foreground',
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
