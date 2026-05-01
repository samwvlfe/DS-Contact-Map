import { ChevronUp, ChevronDown } from "./icons";

export default function NavArrow({ dir, hidden, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#333",
                visibility: hidden ? "hidden" : "visible",
                pointerEvents: hidden ? "none" : "auto",
            }}
        >
            {dir === "up" ? <ChevronUp /> : <ChevronDown />}
        </div>
    );
}
