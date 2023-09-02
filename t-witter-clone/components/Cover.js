import EditableImage from "./EditableImage";

export default function Cover({ src, onChange }) {
  return <EditableImage src={src} onChange={onChange} className={"h-36"} />;
}
