import SingleEntry from "./SingleEntry";
import SingleEntryWithoutEdit from "./SingleEntryWithoutEdit";
export default function UserProfileOptionalEdit({ data, setData, nonmodifiable }) {
	return (
		<div>
			{Object.keys(data).map((key) =>
				nonmodifiable[key] ? (
					<SingleEntryWithoutEdit
						label={key}
						initialValue={data[key]}
						data={data}
						setData={setData}
					/>
				) : (
					<SingleEntry
						label={key}
						initialValue={data[key]}
						data={data}
						setData={setData}
					/>
				)
			)}
		</div>
	);
}
