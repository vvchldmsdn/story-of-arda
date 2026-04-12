export default async function NewDetail({params} : any) {
  console.log(typeof(params))
  return (
    <div className="h-screen">
      <h1>{params.subject}</h1>
    </div>
  )
}