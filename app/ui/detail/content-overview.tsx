import { fetchOverviewBriefDescription, fetchOverviewImage } from "@/app/lib/data-fetch/fetchDetailDatas";
import { RightArrow } from "@/app/lib/icons";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";

export default function ContentOverview({ enName }: { enName: string }) {
  console.log('여기입니다',enName)
  

  // console.log(enName);

  // const overviewImage: string = await fetchOverviewImage(enName);
  // const briefDescription: string = await fetchOverviewBriefDescription(enName);
  // console.log(briefDescription);

  return (
    <Card className="py-4 w-[300px] bg-ardagrey">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex justify-center">
        <div className="whitespace-normal w-full">
          <div className="flex justify-between items-center mb-4 text-eeeeee w-full">
            <h4 className="font-bold text-2xl">{enName}</h4>
            <Button className="ml-2" href="/target-page" variant="light">
              <Link href={`/detail/${enName}`}><RightArrow /></Link>
            </Button>
          </div>
          <p className="text-default-400 line-clamp-3 text-justify">
            asdfsdfawefsdvv wae
          </p>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          isZoomed
          alt="Card background"
          className="object-cover rounded-xl max-h-[160px]"
          src="/fantasy_background.jpeg"
          width={300}
        />
      </CardBody>
    </Card>
  )
}