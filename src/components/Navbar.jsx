import { Link } from "react-router-dom";
import { ToggleTheme } from "./ui/toogle-theme";
import { Button } from "./ui/button";
import { ArrowLeftFromLine, Bell, DoorOpen, MessageSquare } from "lucide-react";
import { useContext } from "react";
import authContext from "@/context/auth-provider";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import ButtonFullScreen from "./ui/button-fullscreen";
import LogoFacell from "./ui/logo-facell";
import { useSidebar } from "@/context/sidebar-store";

const Navbar = () => {
  const { user, logout } = useContext(authContext);
  const [sidebarOpen, mobile] = useSidebar((state)=>([state.sidebarOpen, state.mobile]))

  return (
    <nav className=" flex w-full gap-3 p-3 items-center border-2 justify-end sticky top-0 backdrop-blur-sm bg-white/10">
      {!sidebarOpen && mobile && (<LogoFacell size='20' className='me-auto' />)}

      <div className="flex gap-3 items-center">

      <Button size={"icon"} variant="outline" className="invisible relative">
        <Bell size={20} />
        <Badge variant="destructive" className={"absolute -top-2 -right-2"}>
          3
        </Badge>
      </Button>
      <Button size={"icon"} variant="outline" className="invisible relative">
        <MessageSquare size={20} />
        <Badge variant="destructive" className={"absolute -top-2 -right-2"}>
          3
        </Badge>
      </Button>

     <ButtonFullScreen size="icon" variant='outline' className='shrink-0'  />

      <ToggleTheme className={'shrink-0'}/>

      <DropdownMenu>
        <DropdownMenuTrigger variant="outline" size="icon" className="shrink-0 overflow-hidden">
            <img src={user.img_url} className=" w-10 h-10 rounded-sm"/>
            <span className="sr-only">User</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="outline" className="w-full justify-start gap-2 cursor-pointer" onClick={()=>logout()}>
           
              <DoorOpen size={20}/>
              <span>Sair</span>
           
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
