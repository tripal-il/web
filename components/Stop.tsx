interface StopData {
    stop_name: string;
    stop_id: string;
    stop_lat: number;
    stop_lon: number;
}

// check discord
const StopFC: React.FC<StopData> = ({stop_name, stop_id, stop_lat, stop_lon }: StopData) => {
    return (
        <div className="rounded-md border-white border-2">
             
        </div>
    )
}