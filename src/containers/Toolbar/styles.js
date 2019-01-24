const styles = theme => ({
  root: { display: 'flex' },
  appBar: {
    height: '64px',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  hide: {
    display: 'none'
  },
  title: {
    textDecoration: 'none',
    color: '#3f51b5',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.7em'
    }
  },
  toolbarContent: {
    flexGrow: 1,
    margin: '0 20px'
  },
  logo: {
    length: '60px',
    width: '60px'
  }
});

export default styles;
