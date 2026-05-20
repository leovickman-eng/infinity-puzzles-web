'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export type Character = {
  id: number;
  name: string;
  description: string;
  color: string;
  imageUrl?: string;
  lottieData?: object;
};

type Props = {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
};

export default function CharacterCard({ character, size = 'md' }: Props) {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <div className="group flex flex-col items-center gap-3 cursor-pointer">
      {/* Animation or image container */}
      <div
        className={`${sizeClasses[size]} relative rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105`}
        style={{ backgroundColor: `${character.color}18` }}
      >
        {/* Soft border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `inset 0 0 0 2px ${character.color}60` }}
        />

        {character.lottieData ? (
          <Lottie
            animationData={character.lottieData}
            loop
            autoplay
            className="w-full h-full"
          />
        ) : character.imageUrl ? (
          <Image
            src={character.imageUrl}
            alt={character.name}
            fill
            className="object-contain p-4"
          />
        ) : (
          // Placeholder: colored shape
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full opacity-60"
              style={{ backgroundColor: character.color }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="font-display font-semibold text-foreground text-sm md:text-base">
          {character.name}
        </h3>
        {character.description && (
          <p className="font-body text-xs md:text-sm text-foreground/50 mt-0.5 max-w-[160px]">
            {character.description}
          </p>
        )}
      </div>
    </div>
  );
}
