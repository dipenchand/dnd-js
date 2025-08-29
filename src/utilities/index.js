const defaultInitializer = (index) => index;

export function createRange(length, initializer = defaultInitializer) {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export function getColor(id) {
    switch (String(id)[0]) {
        case "A":
            return "#7193f1";
        case "B":
            return "#ffda6c";
        case "C":
            return "#00bcd4";
        case "D":
            return "#ef769f";
    }

    return undefined;
}
