import sharp from "sharp";

import { getBasicTemplate } from "../templates/basic";

export const getOgImageData = async (page: string): Promise<Buffer<ArrayBufferLike>> => {

  let title = page;

  if (title === "faq") {
    title = "F.A.Q.";
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);

  const svg = getBasicTemplate(title);

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