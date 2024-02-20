import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import DetailLinkArrow from "../atoms/DetailLinkArrow";

export default function ContentOverview({ enName }: { enName: string }) {

  return (
    <Card className="py-4 w-[300px] bg-ardagrey">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex justify-center">
        <div className="whitespace-normal w-full">
          <div className="flex justify-between items-center mb-4 text-eeeeee w-full">
            <h4 className="font-bold text-2xl">{enName}</h4>
            <DetailLinkArrow subject={enName}></DetailLinkArrow>
          </div>
          <p className="text-default-400 line-clamp-6 text-justify">
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