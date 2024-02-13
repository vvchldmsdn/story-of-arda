import { RightArrow } from "@/app/lib/icons";
import {Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";

export default function ContentOverview({link}: {link: string}) {


  return (
    <Card className="py-4 w-[300px] bg-ardagrey">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex justify-center">
        <div className="whitespace-normal">
          <div className="flex justify-between items-center mb-4 text-eeeeee">
            <h4 className="font-bold text-large">Frontend Radio Hi Hello</h4>
            <Button className="ml-2" href="/target-page" variant="light">
              <RightArrow/>
            </Button>
          </div>
          <p className="text-default-400 line-clamp-3 text-justify">
            여기에 간략한 설명을 작성하실 수 있습니다. 설명이 세 줄을 넘어갈 경우, 뒷 부분은 자동으로 생략됩니다.
          </p>
        </div>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          isZoomed
          alt="Card background"
          className="object-cover rounded-xl max-h-[200px]"
          src="/fantasy_background.jpeg"
          width={300}
        />
      </CardBody>
    </Card>
  )
}