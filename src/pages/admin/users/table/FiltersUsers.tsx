import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useStoreUsers } from "./store-table";
import { Switch } from "@/components/ui/switch";

const Filters = ({ refetch }: { refetch: () => void }) => {
  const [showInactives, setShowInactives] = useState<boolean>(false);

  const {
    setFilters
  } = useStoreUsers(state => ({
    setFilters: state.setFilters
  }))

  async function handleSearch() {
    await new Promise((resolve) => {
      setFilters({ inactives: showInactives, termo: searchRef.current?.value || "" })
      resolve(true)
    })
    refetch()
  }

  useEffect(()=>{
      handleSearch()
  }, [showInactives])

  const searchRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="flex gap-3 mb-3">
      <Input ref={searchRef} type="search" placeholder="Buscar..." onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch() } }} />

      <div className="flex flex-col items-center">
    <label htmlFor="switchInactives" className="text-xs">Inativos</label>
        <Switch
          id="switchInactives"
          checked={showInactives}
          onCheckedChange={setShowInactives}
          className='mt-0 h-6'
          defaultChecked={false}
        />
      </div>
      <Button onClick={() => handleSearch()}>Procurar</Button>
    </div>
  );
};

export default Filters;
