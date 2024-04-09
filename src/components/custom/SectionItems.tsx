import { useState } from "react";

interface SectionItemsProps {
    title: string,
    itemsLength: number,
    btnAdd?: React.ReactElement,
    content: React.ReactElement[],
}

const SectionItems = ({
    title,
    itemsLength,
    btnAdd,
    content
}: SectionItemsProps) => {
  const [opin, setOpin] = useState<boolean>(false)

    return ( <section className={`p-2 rounded-lg bg-slate-950 flex flex-col gap-2`}>
    <div onClick={()=>setOpin(prev=>!prev)} className="cursor-pointer p-2 flex justify-between items-center">
      <h3 className="font-bold text-md">{title}: {itemsLength}</h3>
      <div className={`${opin? 'flex':'hidden'}`}>
        {btnAdd}
      </div>
    </div>
    <div className={`${opin? 'flex':'hidden'} flex-col gap-2 max-h-[400px] overflow-auto pe-2`}>
        {content}
    </div>
  </section> );
}
 
export default SectionItems;