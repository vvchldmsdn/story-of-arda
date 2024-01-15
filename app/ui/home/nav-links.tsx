'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: "map-search", href: '/home' },
  { name: 'community', href: '/home/community' },
  { name: 'details', href: '/home/details' }
];

export default function NavLinks() {
  const pathnmae = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
          >
            <div>{link.name}</div>
          </Link>
        )
      })}
    </>
  )
}