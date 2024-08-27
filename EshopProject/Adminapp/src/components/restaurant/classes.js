import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: '20px',
    fontFamily: 'Gilroy-Light, serif',
    textTransform: 'capitalize',
    marginLeft:'1px',
    backgroundColor: '#f95919',
    maxHeight:'100%',
    color: '#fff',
    width: '150px',
    '&:hover': {
      backgroundColor: '#e45826',
      boxShadow: 'none',
    },
  },

  sortButton :{
    borderRadius: '20px',
    fontFamily: 'Gilroy-Light, serif',
    textTransform: 'capitalize',
    marginLeft:'1px',
    borderColor:'#000',
    marginBottom:'7px',
    backgroundColor: '#fff',
    color: '#000',
    width: '150px',
    '&:hover': {
      borderColor: '#e45826',
      boxShadow: 'none',
    },
  },

  dwnButton:{
    borderRadius: '20px',
    fontFamily: 'Gilroy-Light, serif',
    textTransform: 'capitalize',
    marginTop:'10px',
    backgroundColor: '#d62828',
    color: '#fff',
    maxWidth:'100%',
    width: '300px',
    '&:hover': {
      backgroundColor: '#d62830',
      boxShadow: 'none',
    },
  },
  image: {
    width: 300,
    height: 200,
    maxWidth: '100%',
    maxHeight: '100%',
  },
  
  linkButton: {
    fontFamily: 'Gilroy-Light, serif',
    fontSize:'0.78rem',
    textTransform: 'capitalize',
    color:"#d62828",
    marginRight: '10px', 
    '&:hover':{
      backgroundColor: 'transparent'
    }
  }  ,
  phoneBtn: {
    fontFamily: 'Gilroy-ExtraBold, serif',
    fontSize:'0.9rem',
    textTransform: 'capitalize',
    fontWeight:'bold',
    marginRight: '10px', 
    '&:hover':{
      backgroundColor: 'transparent'
    }
  } ,
  
  description :{
    fontFamily: 'SegoeUI-Light, Segoe UI',
    fontWeight: 300,
    textAlign: 'center',
    justifyContent:'center',
    fontSize:'20px'
  },
  map :{
    height: '200px',
    marginTop: '5px',
    width: '100%'    
  },
  
  logo: {
    height: '150px'
  },
 phone:{
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    justifyContent:'center'
    
  },
 }
  

}))
