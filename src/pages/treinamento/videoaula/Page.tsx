import { YoutubeVideo } from "@/components/custom/YoutubeVideo";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const VideoAulaPage = () => {
    const [secoesAbertas, setSecoesAbertas] = useState<number[]>([0])
    const secoes = [
        {
            id: 1,
            nome: 'Nova Intranet',
            videos: [
                {
                    id: 1,
                    title: 'Inicial',
                    url: 'https://youtu.be/sB8ri9uv2Nk'
                },
                {
                    id: 2,
                    title: 'Administração',
                    url: 'https://youtu.be/Ev1KRhtlxl4'
                },

            ]
        },
        {
            id: 1,
            nome: 'Financeiro',
            videos: [
                {
                    id: 1,
                    title: 'Nova solicitação',
                    url: 'https://youtu.be/Bt39e0dGwpc'
                },
                {
                    id: 2,
                    title: 'Conciliação de Tarifas',
                    url: 'https://youtu.be/WTywDyRbaAo'
                },
                
            ]
        },
    ]

    const toggleSecaoAberta = (index: number)=>{
        if(secoesAbertas?.includes(index)){
            setSecoesAbertas(prev=>prev.filter(n=>n !== index))
        }else{
            setSecoesAbertas(prev=>([...prev, index]))
        }
    }

    return (<div className="flex flex-col gap-4 p-4">
        {secoes.map((secao, indexSecao) => (
            <section key={`secao.${indexSecao}`} className="flex flex-col gap-3 flex-1 border rounded-lg p-3 shadow-lg">
                <div className="flex gap-2 items-center cursor-pointer" onClick={()=>{toggleSecaoAberta(indexSecao)}}>
                    <h2 className="text-xl font-bold">{secao.nome}</h2>
                    <Badge>{secao.videos.length}</Badge>
                </div>
                <article className={`${secoesAbertas.includes(indexSecao) ? 'grid' : 'hidden'} grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 overflow-auto scroll-thin pb-3`}>
                    {secao.videos.map((video, index) => (
                        <div key={`video.${index}`} className="grid gap-3 border rounded-lg">
                            <YoutubeVideo url={video.url} />
                        </div>
                    ))}
                </article>
            </section>
        ))}
    </div>);
}
