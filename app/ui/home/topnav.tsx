import NavLinks from "./nav-links";

export default function Topnav() {
  return (
    <div className="flex flex-row h-full p-2">
      <div className="w-64 mr-4 flex justify-center items-center text-3xl text-eeeeee">
        Story of Arda
      </div>
      <div className="mr-4 grow flex flex-row gap-16 justify-center items-center text-eeeeee text-xl">
        <NavLinks/>
      </div>
      <div className="w-64"></div>
    </div>
  )
}