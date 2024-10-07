import SingleEntry from "./SingleEntry";
export default function ListOfThings({ data, setData }) {
  return (
    <div>
      {data.map((element, index) => (
        <SingleEntry
          label={index}
          initialValue={element._id}
          data={data}
          setData={setData}
        />
      ))}
    </div>
  );
}
