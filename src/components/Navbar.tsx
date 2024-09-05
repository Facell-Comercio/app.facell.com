import { useAuthStore } from "@/context/auth-store";
import { useSidebar } from "@/context/sidebar-store";
import { Bell, DoorOpen, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import ButtonFullScreen from "./custom/ButtonFullScreen";
import LogoFacell from "./custom/LogoFacell";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ToggleTheme } from "./ui/toogle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [sidebarOpen, mobile] = useSidebar((state) => [
    state.sidebarOpen,
    state.mobile,
  ]);

  return (
    <nav className=" flex w-full gap-3 p-3 items-center border justify-end sticky top-0 backdrop-blur-sm z-20">
      {!sidebarOpen && mobile && <LogoFacell className="me-auto" />}

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

        <ButtonFullScreen size="icon" variant="outline" className="shrink-0" />

        <ToggleTheme className={"shrink-0"} />

        <DropdownMenu>
          <DropdownMenuTrigger className="shrink-0 overflow-hidden">
            {user?.img_url ? (
              <Avatar className="rounded-sm">
                <AvatarFallback>
                  <User className="w-10 h-10 p-2 text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-sm" />
                </AvatarFallback>
                <AvatarImage src={user.img_url} />
              </Avatar>
            ) : (
              <span className="">
                <User className="w-10 h-10 p-2 text-gray-400 bg-gray-200 dark:bg-gray-800 rounded-sm" />
              </span>
            )}
            <span className="sr-only">User</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="w-full justify-start p-0 cursor-pointer">
              <Link
                to="/perfil"
                className="flex gap-2 items-center px-2 py-1.5 w-full"
              >
                <User size={20} />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full justify-start gap-2 cursor-pointer"
              onClick={() => logout()}
            >
              <DoorOpen size={20} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
