import Link from "next/link";
import DrawContainer from "@/components/DrawContainer";


type PageProps = {
    params: {roomName: string}
};


export default function Page({params}: PageProps) {
    return (
        <main>
            <div>Drawing Page</div>
            <Link href="/">Back</Link>
            <DrawContainer roomName={params.roomName}/>
        </main>
    );
};
