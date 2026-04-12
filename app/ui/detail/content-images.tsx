import { fetchContentImages } from "@/app/lib/data-fetch/fetchDetailDatas";
import ContentImageStrip from "./content-image-strip";

export default async function ContentImages({ subject }: { subject: string }) {
  const images = await fetchContentImages(subject);

  return <ContentImageStrip images={images}></ContentImageStrip>
}

