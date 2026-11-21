import type { ImageMetadata } from 'astro';

/**
 * Every image in packages/brand/photos/, keyed by filename without extension.
 * A file named after a photo slot (config/photos.ts) or product photo key
 * replaces that slot's placeholder automatically.
 */
const files = import.meta.glob<ImageMetadata>('../photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
});

const bySlot = new Map(Object.entries(files).map(([path, img]) => [path.split('/').pop()!.replace(/\.[^.]+$/, ''), img]));

export const findPhoto = (slot: string): ImageMetadata | undefined => bySlot.get(slot);
export const availablePhotos = () => [...bySlot.keys()];
