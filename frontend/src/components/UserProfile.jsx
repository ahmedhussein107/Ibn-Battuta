import SingleEntry from "./SingleEntry";
export default function UserProfile({ data, setData }) {
    return (
        <div>
            {Object.keys(data).map((key) => (
                <SingleEntry
                    label={key}
                    initialValue={data[key]}
                    data={data}
                    setData={setData}
                />
            ))}
        </div>
    );
}
