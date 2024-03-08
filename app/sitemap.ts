import { MetadataRoute } from 'next';
import { fetchAllEnname } from './lib/data-fetch/fetchHomeDatas';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const enName = await fetchAllEnname();
  // enName = [{name: '~~~'}, {name: '~~~'}, {name: '~~~'}, {name: '~~~'}, ...]

  const result = [{
    url: 'https://story-of-arda.vercel.app',
    lastModified: new Date(),
    changeFrequency: 'yearly' as 'yearly',
    priority: 0.9,
  },
  {
    url: 'https://story-of-arda.vercel.app/',
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 1,
  },
  {
    url: 'https://story-of-arda.vercel.app/home/',
    lastModified: new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 1,
  }];

  enName.forEach((item) => {
    result.push( {
      url: `https://story-of-arda.vercel.app/detail/${item.name}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as 'monthly',
      priority: 0.8,
    })
  });

  console.log(result)

  return result
}

// [
//   {
//     url: 'https://story-of-arda.vercel.app',
//     lastModified: new Date(),
//     changeFrequency: 'yearly',
//     priority: 0.9,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/',
//     lastModified: new Date(),
//     changeFrequency: 'monthly',
//     priority: 1,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/home/',
//     lastModified: new Date(),
//     changeFrequency: 'monthly',
//     priority: 1,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/minas-tirith',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/minas-morgul',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/isengard',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/osgiliath',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/edoras',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: `https://story-of-arda.vercel.app/detail/helm's-deep`,
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/arnor',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/angmar',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
//   {
//     url: 'https://story-of-arda.vercel.app/detail/arthedain',
//     lastModified: new Date(),
//     changeFrequency: 'weekly',
//     priority: 0.8,
//   },
// ]