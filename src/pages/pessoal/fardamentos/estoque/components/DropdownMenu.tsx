import React from 'react';
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shirt, Handshake, HandCoins, ArrowRightLeft } from "lucide-react";
import { useStoreEstoque } from './Store';


const openModal = useStoreEstoque.getState().openModal;



export const Dropdown = () => {
  return (
    <DropdownMenu>
            <DropdownMenuTrigger >
                <span> <Ellipsis/> </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                    <DropdownMenuItem> 
                        <Button className="mx-auto w-full" variant={'default'} size={'sm'}>
                            <Shirt size={12}
                             className="mr-2"
                            />Abastecer</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                         <Button className="mx-auto w-full" variant={'destructive'} size={'sm'}><Handshake size={12} className="mr-2"/>Conceder</Button>
                        </DropdownMenuItem>
                    <DropdownMenuItem> 
                        <Button className="mx-auto w-full" variant={'success'} size={'sm'}><HandCoins size={12} className="mr-2"/>Vender</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem> 
                        <Button className="mx-auto w-full" variant={'secondary'} size={'sm'}><ArrowRightLeft size={12} className="mr-2"/>Remanejar</Button>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
  )
}
