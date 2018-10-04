export const required = v =>{
    if (typeof v === "object") {
        v = v.value;
    }
    const falsy = (typeof v === "string")
        ? (v||"").replace(/ /g, "").length === 0
        : !v;
    
    return falsy ? "Påkrevd" : undefined;
}
