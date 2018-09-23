export const required = v =>{
    if (typeof v === "object") {
        v = v.value;
    }
    return (v||"").replace(/ /g, "").length === 0 ? "Påkrevd" : undefined;
}
