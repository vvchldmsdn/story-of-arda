import { Button } from "@nextui-org/react";
import { RightArrow } from "@/app/lib/icons";
import Link from "next/link";

export default function DetailLinkArrow({subject} : {subject: string}) {
  return (
    <Button className="ml-2" href="/target-page" variant="light">
      <Link href={`/detail/${subject}`}><RightArrow /></Link>
    </Button>
  )
} 