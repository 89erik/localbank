export const required = v =>{
    return (v||"").replace(/ /g, "").length === 0 ? "Påkrevd" : undefined;
}
