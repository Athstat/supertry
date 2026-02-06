import { isMobileApp } from "../../../utils/deviceId/deviceIdUtils";

type Props = {
    link: string
}

export default function YoutubeIFrame({ link }: Props) {

    const isMobile = isMobileApp();
    const allowYoutube = isMobile ? Boolean(window.ALLOW_YOUTUBE_VIDEO) : true;

    const videoId = getYoutubeVideoId(link);

    if (!(videoId && allowYoutube)) {
        return null;
    }

    return (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: '15px'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border border-slate-200 dark:border-slate-600"
            />
        </div>
    )
}


function getYoutubeVideoId(youtubeLink: string) {

    'https://youtu.be/ZkFO4K4kbAE?si=jBZMHk8qMJomYvYr'

    // remove youtube domain
    const afterSlash = youtubeLink.slice(17, youtubeLink.length);
    const [videoId] = afterSlash.split('?');

    return videoId;


}