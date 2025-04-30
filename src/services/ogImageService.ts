import sharp from "sharp";

import { getBasicTemplate } from "../templates/basic";
import { getUnitTemplate } from "../templates/unit";

export interface IUnitOptions {
  type: 'plot' | 'house';
  number: number;
}

export const getOgImageData = async (page: string, unitOptions: IUnitOptions | undefined): Promise<Buffer<ArrayBufferLike>> => {

  let title = page;

  if (title === "faq") {
    title = "F.A.Q.";
  }

  title = title.charAt(0).toUpperCase() + title.slice(1);

  let svg: string = "";

  if (page === "unit") {
    if (unitOptions && unitOptions.type && unitOptions.number) {
      svg = await getUnitTemplate(unitOptions);
    } else {
      svg = getBasicTemplate('Main page');
    }

  } else {
    svg = getBasicTemplate(title);
  }


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