import { Laptop, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider"

export function ToggleTheme({ className }: { className: string }) {
  const { theme, setTheme } = useTheme()
  const handleChangeTheme = (event: React.MouseEvent<HTMLButtonElement>, newTheme: string) => {
    event.stopPropagation()
    setTheme(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn('', className)}>
        <Button variant="outline" size="icon" className='relative'>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="p-1 ">
          <Button
            variant={theme == 'light' ? 'default' : 'outline'}
            size={'sm'}
            className="w-full"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleChangeTheme(e, 'light')}
          ><Sun size={16} className="me-2" /> Light</Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-1 ">
          <Button
            variant={theme == 'dark' ? 'default' : 'outline'}
            size={'sm'}
            className="w-full"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleChangeTheme(e, 'dark')}
          ><Moon size={16} className="me-2" /> Dark</Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-1 ">
          <Button
            variant={theme == 'system' ? 'default' : 'outline'}
            size={'sm'}
            className="w-full"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleChangeTheme(e, 'system')}
          ><Laptop size={16} className="me-2" /> System</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}