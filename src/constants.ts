/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'CyberUnit-7',
    coverUrl: 'https://picsum.photos/seed/cyberpunk/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#f472b6', // pink-400
  },
  {
    id: '2',
    title: 'Digital Horizon',
    artist: 'SynthWave Rider',
    coverUrl: 'https://picsum.photos/seed/retrowave/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#22d3ee', // cyan-400
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'NetRunner',
    coverUrl: 'https://picsum.photos/seed/matrix/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#65a30d', // lime-600
  },
];

export const GAME_SETTINGS = {
  GRID_SIZE: 20,
  INITIAL_SNAKE_SPEED: 150,
  MIN_SNAKE_SPEED: 60,
  SPEED_INCREMENT: 2,
};
