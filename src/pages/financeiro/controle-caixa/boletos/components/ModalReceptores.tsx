import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { BsPeople } from "react-icons/bs";

export default function ModalReceptoresBoletos() {
  return (
    <Dialog>
        <DialogTrigger><Button variant={'tertiary'}><BsPeople size={18} className="me-2"/> Receptores</Button></DialogTrigger>
        <DialogContent>
            <Card>
                <CardContent>
                    <CardHeader>
                        <div className="flex gap-3">
                            <label>Filial</label>
                            <Input placeholder="Digite o email"/>
                            <Button><Filter size={18} className="me-2"/> Filtrar</Button>
                        </div>
                    </CardHeader>
                    <CardFooter></CardFooter>
                </CardContent>
            </Card>
        </DialogContent>
    </Dialog>
  )
}
