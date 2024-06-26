export type YoutubeVideoProps = {
    url: string,
}
// Função para extrair o ID do vídeo da URL
const getYouTubeId = (url:string) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

export const YoutubeVideo = ({url}: YoutubeVideoProps) => {
     
    const videoId = getYouTubeId(url);

    if (!videoId) {
        return <p>Invalid YouTube URL</p>;
    }

    return (
        <div className="relative pb-[56.25%] h-0 overflow-hidden max-w-full bg-black">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
            ></iframe>
        </div>
    );
}