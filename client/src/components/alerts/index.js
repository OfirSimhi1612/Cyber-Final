import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import Post from '../posts'
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


const Accordion = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);
  
const AccordionSummary = withStyles({
root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
    minHeight: 56,
    },
},
content: {
    '&$expanded': {
    margin: '12px 0',
    },
},
expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
root: {
    padding: theme.spacing(2),
},
}))(MuiAccordionDetails);


function Alerts() {

    const [alerts, setAlerts] = useState([])
    const [expanded, setExpanded] = React.useState();

    const handleChange = (panel, id, read) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
        (newExpanded && !read)  && readAlert(id)
    };

    const fetchAlerts = React.useCallback(() => {
        fetch('/api/alerts/root')
        .then(res => res.json())
        .then(res => setAlerts(res))
        console.log('test')
    }, [])

    useEffect(fetchAlerts, [])

    const readAlert = React.useCallback((id) => {
        fetch(`/api/alerts/read/${id}`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(res => {
            if(res){
                const tempAlerts = alerts.slice()
                const Alert = tempAlerts.find(alert => alert._id === id)
                Alert.read = true
                setAlerts(tempAlerts)
            }
        })
        .catch(err => console.log(err))
    }, [alerts])

    const removeAlert = React.useCallback((id) => {
        fetch(`/api/alerts/${id}`, {
            method: 'DELETE'
        })
        .then(res => res)
        .then(res => {
            if(res){
                const tempAlerts = alerts.slice()
                const index = tempAlerts.findIndex(alert => alert._id === id)
                tempAlerts.splice(index, 1)
                setAlerts(tempAlerts)
            }
        })
        .catch(err => console.log(err))
    }, [alerts])

    return (
        <div>
            {alerts.length > 0 ?
                <div>
                    {alerts.map((alert, index) => {
                        return(
                            <Accordion square expanded={expanded === index} onChange={handleChange(index, alert._id, alert.read)}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Typography>
                                        {!alert.read && <NewReleasesIcon/>}
                                        {alert.notification}
                                            <IconButton 
                                                aria-label="delete" 
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeAlert(alert._id)
                                                }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {alert.post ? <Post post={alert.post}/> : alert.reason}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            )
                        })
                    }
                    
                </div>
                : <div>No New Alerts!</div>   
            }
        </div>
    )
}


export default Alerts