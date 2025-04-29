import sharp from "sharp";

import { getBasicTemplate } from "../templates/basic";

export const getOgImageData = async (page: string): Promise<Buffer<ArrayBufferLike>> => {
  const svg = getBasicTemplate(page);

  const b = Buffer.from(svg);
  
  let image: Buffer<ArrayBufferLike>;

  try {
    image = await sharp(b).jpeg().toBuffer();
  } catch (e) {
    console.error(e);
    throw e;
  }

  return image;
};