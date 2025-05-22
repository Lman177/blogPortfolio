// export const slideUp = {
//     initial: {
//         y: 300
//     },
//     enter: {
//         y: 0,
//         transition: {duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 2.5}
//     }
// }

export const slideUp = {
    initial: {
        y: "100%"
    },
    open: (i) => ({
        y: "0%",
        transition: {duration: 0.5, delay: 0.01 * i}
    }),
    closed: {
        y: "100%",
        transition: {duration: 0.5}
    }
}