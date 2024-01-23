import Topnav from "../ui/topnav";

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex-col">
      <div className="flex-none h-24">
        <Topnav></Topnav>
      </div>
      <div>{children}</div>
    </div>
  )
};