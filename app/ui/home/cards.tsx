import {Card, CardFooter, Image, Button} from "@nextui-org/react";

export default function CardWrapper() {
  const imgUrls = [
    { key: 1, url: '/swordsman.jpeg'},
    { key: 2, url: '/ninja.jpeg' }
  ]

  return (
    <div className="flex flex-row space-x-6 justify-between h-full">
      {imgUrls.map((url) => {
        return (
          <Cards key={url.key} url={url.url}></Cards>
        )
      })}
    </div>
  )
};

export function Cards({ url }: {url: string}) {
  return (
    <>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none w--80 h-full flex justify-center items-center flex-1"
      >
        <Image
          alt="Woman listing to music"
          className="object-cover object-center w-full h-full"
          src={url}
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-white/80">Available soon.</p>
          <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
            Notify me
          </Button>
        </CardFooter>
      </Card>
    </>
  )
};