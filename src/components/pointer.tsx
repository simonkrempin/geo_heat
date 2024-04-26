import { pointer } from "d3-selection";
import React, {
	useEffect,
	useState,
} from "react";

interface PointerInfo {
	country: string;
	position: [number, number];
}

export default function Pointer() {
	const [pointerInfo, setPointerInfo] = useState<PointerInfo | null>(null);

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			const elements = document.elementsFromPoint(event.clientX, event.clientY);

			let countryName = elements.length > 4 ? elements[0].getAttribute("data-countryname") : null;

			if (!countryName) {
				setPointerInfo(null);
				return;
			}

			setPointerInfo({
				country: countryName,
				position: [event.clientX, event.clientY],
			})
		}

		addEventListener("mousemove", onMouseMove);

		return () => {
			removeEventListener("mousemove", onMouseMove);
		};
	}, []);

	if (!pointerInfo) {
		return;
	}

	return (
		<div
			style={{
				position: "fixed",
				top: pointerInfo?.position[1],
				left: pointerInfo?.position[0],
				padding: "1rem",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				color: "white",
				fontSize: "1.5rem",
				pointerEvents: "none",
			}}
		>
			{pointerInfo?.country}
		</div>
	)
}