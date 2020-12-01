import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';


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

function CustomizedAccordions() {
const [expanded, setExpanded] = React.useState('panel1');

const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
};
}



function Alerts() {

    const [alerts, setAlerts] = useState([])
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const fetchAlerts = React.useCallback(() => {
        fetch('/api/alerts/root')
        .then(res => res.json())
        .then(res => setAlerts(res))
    }, [])

    useEffect(fetchAlerts, [])



    return (
        <div>
            {alerts.length > 0 ?
                <div>
                    <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>Collapsible Group Item #1</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
                : <div>No New Alerts!</div>   
            }
        </div>
    )
}


export default Alerts