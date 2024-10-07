import SingleEntry2 from "./SingleEntry2";
export default function UserProfile({ data, setData, path }) {
  return (
    <div>
      {Object.keys(data).map((key) => (
        <SingleEntry2
          label={key}
          initialValue={data[key]}
          data={data}
          setData={setData}
          path={path}
        />
      ))}
    </div>
  );
}
