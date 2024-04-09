import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Users from "./users/Users";
import Departamentos from "./departamentos/Departamentos";
import Filiais from "./filiais/Filiais";
import GruposEconomicos from "./grupos-economicos/GruposEconomicos";


const AdminPage = () => {
    return (<div className="content p-5">
        <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full justify-start" >
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
                <TabsTrigger value="filiais">Filiais</TabsTrigger>
                <TabsTrigger value="gruposEconomicos">Grupos econômicos</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
                <Users />
            </TabsContent>
            <TabsContent value="departamentos">
                <Departamentos />
            </TabsContent>
            <TabsContent value="filiais">
                <Filiais />
            </TabsContent>
            <TabsContent value="gruposEconomicos">
                <GruposEconomicos />
            </TabsContent>

        </Tabs>


    </div>);
}

export default AdminPage;