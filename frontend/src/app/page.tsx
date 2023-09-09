import RoomSelector from "@/components/RoomSelector";


export default function Home() {
    return (
        <main className="h-screen">
            <div className="flex flex-col justify-center items-center h-1/2 text-center">
                <h1 className="text-2xl mb-8">Main Page</h1>
                <RoomSelector/>
            </div>
        </main>
    );
};
