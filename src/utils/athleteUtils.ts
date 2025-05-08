
/** Formats a position by removing any `-` and capitalising the first letter in each word */
export const formatPosition = (inStr: string) => {
    const parts = inStr.split("-");
    let outStr = "";

    parts.forEach((part) => {
        if (part.length === 0) return;
        
        if (part.length > 1) {
            const partNormalised = part[0].toUpperCase() + part.slice(1);
            outStr += partNormalised + " ";
        } else {   
            const partNormalised = part[0].toUpperCase();
            outStr += partNormalised + " ";
        }
    });

    return outStr
}