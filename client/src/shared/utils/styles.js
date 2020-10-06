export const sizes = {
  headerHeight: 48,
  searchBarWidth: 680,
}

export const durations = {
  header: {
    enter: 400,
    exit: 400,
  },
  modal: {
    enter: 1000,
    exit: 200,
  },
}

export const css = {
  borderBottom: color => ({
    content: '""',
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottom: `1px solid ${color}`,
  }),
}
