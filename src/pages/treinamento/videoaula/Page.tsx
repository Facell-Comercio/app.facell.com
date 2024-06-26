import { YoutubeVideo } from "@/components/custom/YoutubeVideo";

export const VideoAulaPage = () => {
    const secoes  = [
        {
            id: 1,
            nome: 'Nova Intranet',
            videos: [
                {
                    id: 1,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 2,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 3,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                
            ]
        },
        {
            id: 1,
            nome: 'Financeiro',
            videos: [
                {
                    id: 1,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 2,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 3,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 4,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 5,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 6,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 7,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
                {
                    id: 8,
                    url: 'https://youtu.be/3-cWKDj6juc'
                },
            ]
        },
    ]
    return ( <div className="flex flex-col gap-4 p-4">
        {secoes.map(secao=>(
            <section className="flex flex-col gap-3 flex-1">
                <h2 className="text-xl font-bold">{secao.nome}</h2>
                <article className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 overflow-auto scroll-thin pb-3">
                    {secao.videos.map(video=>(
                        <div className="grid gap-3 border rounded-lg">
                            <YoutubeVideo url={video.url} />
                        </div>
                    ))}
                </article>
            </section>
        ))}
    </div> );
}
 